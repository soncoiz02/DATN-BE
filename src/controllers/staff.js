import mongoose from 'mongoose';
import { endOfDay, startOfDay } from 'date-fns';
import Staff from '../models/staff';
import Order from '../models/order';
import { dateToHourNumber } from '../utils/dateToHourNumber';
import Service from '../models/service';
import User from '../models/user';
import roundedNumber from '../utils/roundedNumber';
import service from '../models/service';

export const createStaff = async (req, res) => {
  try {
    const { cateId, userData } = req.body;
    const haveUsername = await User.findOne({
      username: userData.username,
    }).exec();
    const haveEmail = await User.findOne({ email: userData.email }).exec();
    const havePhone = await User.findOne({ phone: userData.phone }).exec();
    if (haveUsername) {
      return res.status(400).json({
        message: 'Tên tài khoản đã tồn tại',
        field: 'username',
      });
    }
    if (haveEmail) {
      return res.status(400).json({
        message: 'Email đã tồn tại',
        field: 'email',
      });
    }
    if (havePhone) {
      return res.status(400).json({
        message: 'Số điện thoại đã tồn tại',
        field: 'phone',
      });
    }
    const newUser = await User(userData).save();
    await Staff({ staff: newUser._id, category: cateId }).save();
    res.json({
      message: 'Tạo mới nhân viên thành công',
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const staffs = await Staff.find({})
      .populate('staff')
      .populate('category')
      .exec();
    res.json(staffs);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getStaffByCategory = async (req, res) => {
  try {
    const staff = await User.aggregate([
      {
        $lookup: {
          from: 'staffs',
          foreignField: 'staff',
          localField: '_id',
          as: 'staff',
        },
      },
      {
        $match: {
          'staff.category': new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $project: {
          staff: 0,
        },
      },
    ]);
    res.json(staff);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getStaffInTimeSlot = async (req, res) => {
  try {
    const { timeSlot, date } = req.query;
    const startOfDate = startOfDay(new Date(date));
    const endOfDate = endOfDay(new Date(date));
    const service = await Service.findOne({ _id: req.params.id }).exec();

    const order = await Order.aggregate([
      {
        $match: {
          startDate: {
            $gte: startOfDate,
            $lte: endOfDate,
          },
          status: {
            $ne: '632bc765dc2a7f68a3f383eb',
          },
        },
      },
      {
        $lookup: {
          from: 'services',
          foreignField: '_id',
          localField: 'serviceId',
          as: 'service',
        },
      },
      {
        $match: {
          'service.categoryId': new mongoose.Types.ObjectId(service.categoryId),
        },
      },
      {
        $project: {
          service: 0,
        },
      },
    ]);

    const listStaff = [];

    const duration = roundedNumber((service.duration + 15) / 60);
    const startTime = +timeSlot;
    const endTime = +timeSlot + duration;

    for (let i = 0; i < order.length; i++) {
      const orderStartTime = roundedNumber(
        dateToHourNumber(order[i].startDate)
      );
      const orderEndTime = roundedNumber(dateToHourNumber(order[i].endDate));
      if (
        (orderEndTime >= startTime &&
          roundedNumber(orderEndTime - startTime) <= duration) ||
        (orderStartTime <= endTime &&
          roundedNumber(endTime - orderStartTime) <= duration)
      ) {
        if (listStaff.includes(order[i].staff)) return;
        listStaff.push(order[i].staff);
      }
    }

    res.json(listStaff);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getStaffInTimeSlotAllService = async (req, res) => {
  try {
    const { timeStart, date } = req.query;
    const storeId = req.params.id;
    const startOfDate = startOfDay(new Date(date));
    const endOfDate = endOfDay(new Date(date));
    const services = await Service.aggregate([
      {
        $lookup: {
          from: 'categories',
          foreignField: '_id',
          localField: 'categoryId',
          as: 'cate',
        },
      },
      {
        $match: {
          'cate.storeId': new mongoose.Types.ObjectId(storeId),
        },
      },
      {
        $project: {
          cate: 0,
        },
      },
    ]);

    // eslint-disable-next-line consistent-return
    const getOrders = async (service) => {
      try {
        const orders = await Order.find({
          startDate: {
            $gte: startOfDate.toISOString(),
            $lte: endOfDate.toISOString(),
          },
          status: {
            $ne: new mongoose.Types.ObjectId('632bc765dc2a7f68a3f383eb'),
          },
          'servicesRegistered.service': new mongoose.Types.ObjectId(
            service._id
          ),
        }).exec();

        return orders;
      } catch (error) {
        res.status(400).json({
          message: error.message,
        });
      }
    };

    // eslint-disable-next-line consistent-return
    const getServiceStaff = async (service) => {
      try {
        const staffs = await User.aggregate([
          {
            $lookup: {
              from: 'staffs',
              foreignField: 'staff',
              localField: '_id',
              as: 'staffs',
            },
          },
          {
            $match: {
              'staffs.category': new mongoose.Types.ObjectId(
                service.categoryId
              ),
            },
          },
        ]);

        return staffs.length;
      } catch (error) {
        res.status(400).json({
          message: error.message,
        });
      }
    };

    const serviceOrders = await Promise.all(
      services.map((service) => getOrders(service))
    );

    const serviceStaffs = await Promise.all(
      services.map((service) => getServiceStaff(service))
    );

    const listStaffOfService = [];

    serviceOrders.forEach((orders, index) => {
      const listStaff = [];
      const serviceDuration = roundedNumber(
        (services[index].duration + 15) / 60
      );
      const timeSlotStart = +timeStart;
      const timeSlotEnd = roundedNumber(+timeStart + serviceDuration);
      orders.forEach((order) => {
        order.servicesRegistered.forEach((service) => {
          const orderStartTime = roundedNumber(
            dateToHourNumber(service.timeStart)
          );
          const orderEndTime = roundedNumber(dateToHourNumber(service.timeEnd));

          if (
            (orderEndTime >= timeSlotStart &&
              roundedNumber(orderEndTime - timeSlotStart) <= serviceDuration) ||
            (orderStartTime <= timeSlotEnd &&
              roundedNumber(timeSlotEnd - orderStartTime) <= serviceOrders)
          ) {
            listStaff.push(service.staff);
          }
        });
      });

      listStaffOfService.push(listStaff);
    });

    const filteredServices = services.map((service, index) => ({
      ...service,
      isDisable: listStaffOfService[index].length === serviceStaffs[index],
    }));

    // lấy tổng số nv ra check

    res.json(filteredServices);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getStaffPerPage = async (req, res) => {
  try {
    const { page, name, email, phone, category, birthday } = req.query;
    const limit = 10;
    const pageSkip = (page - 1) * limit;
    const filter = {
      ...(name && {
        name: { $regex: name, $options: 'i' },
      }),
      ...(email && {
        email: { $regex: email, $options: 'i' },
      }),
      ...(phone && {
        phone: { $regex: phone, $options: 'i' },
      }),
      ...(category && {
        'category._id': new mongoose.Types.ObjectId(category),
      }),
      ...(birthday && {
        birthday,
      }),
    };

    const staffs = await User.aggregate([
      {
        $lookup: {
          from: 'staffs',
          foreignField: 'staff',
          localField: '_id',
          as: 'staff',
        },
      },
      {
        $lookup: {
          from: 'categories',
          foreignField: '_id',
          localField: 'staff.category',
          as: 'category',
        },
      },
      {
        $match: {
          ...filter,
          roleId: new mongoose.Types.ObjectId('6336719e9f0cdce7e66cba16'),
        },
      },
      {
        $project: {
          staff: 0,
          password: 0,
        },
      },
    ])
      .limit(limit)
      .skip(pageSkip);
    const total = await User.aggregate([
      {
        $lookup: {
          from: 'staffs',
          foreignField: 'staff',
          localField: '_id',
          as: 'staff',
        },
      },
      {
        $lookup: {
          from: 'categories',
          foreignField: '_id',
          localField: 'staff.category',
          as: 'category',
        },
      },
      {
        $match: {
          ...filter,
          roleId: new mongoose.Types.ObjectId('6336719e9f0cdce7e66cba16'),
        },
      },
      {
        $project: {
          staff: 0,
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    res.json({
      total: total.length > 0 ? total[0].count : 0,
      data: staffs.map((item) => ({ ...item, category: item.category[0] })),
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
