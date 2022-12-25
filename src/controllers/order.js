import { endOfDay, endOfToday, startOfDay, startOfToday } from 'date-fns';
import { decode } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ActivityLog from '../models/activityLog';
import Order from '../models/order';
import Service from '../models/service';
import Staff from '../models/staff';
import User from '../models/user';
import Voucher from '../models/voucher';
import { dateToHourNumber } from '../utils/dateToHourNumber';
import roundedNumber from '../utils/roundedNumber';

// eslint-disable-next-line import/prefer-default-export
export const create = async (req, res) => {
  try {
    const { startDate, servicesRegistered } = req.body;
    const startOfDate = startOfDay(new Date(startDate));
    const endOfDate = endOfDay(new Date(startDate));

    const handleGetFreeStaff = async (servicesRegister) => {
      const service = await Service.findOne({
        _id: servicesRegister.service,
      }).exec();

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
          $match: {
            'staff.category': new mongoose.Types.ObjectId(service.categoryId),
          },
        },
        {
          $project: {
            staff: 0,
          },
        },
      ]);

      const orders = await Order.aggregate([
        {
          $match: {
            startDate: {
              $gte: startOfDate,
              $lte: endOfDate,
            },
            status: {
              $ne: new mongoose.Types.ObjectId('632bc765dc2a7f68a3f383eb'),
            },
          },
        },
        {
          $lookup: {
            from: 'services',
            foreignField: '_id',
            localField: 'servicesRegistered.service',
            as: 'service',
          },
        },
        {
          $match: {
            'service.categoryId': new mongoose.Types.ObjectId(
              service.categoryId
            ),
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
      const startTime = roundedNumber(
        dateToHourNumber(servicesRegister.timeStart)
      );
      const endTime = roundedNumber(dateToHourNumber(servicesRegister.timeEnd));

      orders.forEach((order) => {
        order.servicesRegistered.forEach((item) => {
          const orderStartTime = roundedNumber(
            dateToHourNumber(item.timeStart)
          );
          const orderEndTime = roundedNumber(dateToHourNumber(item.timeEnd));
          if (
            (orderEndTime >= startTime &&
              roundedNumber(orderEndTime - startTime) <= duration) ||
            (orderStartTime <= endTime &&
              roundedNumber(endTime - orderStartTime) <= duration)
          ) {
            if (listStaff.includes(item.staff.toString())) return;
            listStaff.push(item.staff.toString());
          }
        });
      });

      const freeStaff = staffs.filter(
        (item) => !listStaff.includes(item._id.toString())
      );

      const randomStaff =
        freeStaff[Math.floor(Math.random() * freeStaff.length)];

      const servicesRegisterData = {
        ...servicesRegister,
        staff: randomStaff._id,
      };

      // eslint-disable-next-line consistent-return
      return servicesRegisterData;
    };

    const data = await Promise.all(
      servicesRegistered.map((service) => handleGetFreeStaff(service))
    );

    if (!data) {
      return res.status(400).json({
        message: 'Đặt lịch thất bại',
      });
    }

    const newOrder = await new Order({
      ...req.body,
      servicesRegistered: data,
    }).save();

    if (newOrder.voucher) {
      await Voucher.findOneAndUpdate(
        { _id: newOrder.voucher },
        { isUsed: true }
      ).exec();
    }

    // eslint-disable-next-line no-underscore-dangle
    const detailOrder = await Order.findById(newOrder._id)
      .populate('status')
      .populate('userId')
      .exec();

    const firstActivityLog = {
      content: `Đăng ký dịch vụ`,
      userId: detailOrder.userId,
      orderId: detailOrder._id,
    };

    await new ActivityLog(firstActivityLog).save();

    res.json(detailOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const list = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageLimit = +limit || 10;
    const pageNum = (+page - 1) * limit;
    const order = await Order.find({})
      .populate('status')
      .populate({
        path: 'servicesRegistered.service',
        model: 'Service',
        populate: {
          path: 'categoryId',
          model: 'Category',
          populate: {
            path: 'storeId',
            model: 'Store',
          },
        },
      })
      .populate({
        path: 'servicesRegistered.staff',
        model: 'User',
      })
      .populate('userId')
      .populate('voucher')
      .limit(pageLimit)
      .skip(pageNum)
      .sort([['createdAt', -1]])
      .exec();

    const total = await Order.count().exec();

    res.json({ total, order });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id }).exec();
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    ).exec();
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const read = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id })
      .populate('status')
      .populate({
        path: 'servicesRegistered.service',
        model: 'Service',
        populate: {
          path: 'categoryId',
          model: 'Category',
          populate: {
            path: 'storeId',
            model: 'Store',
          },
        },
      })
      .populate({
        path: 'servicesRegistered.staff',
        model: 'User',
      })
      .populate('userId')
      .populate('voucher')
      .exec();
    const activities = await ActivityLog.find({ orderId: req.params.id })
      .populate('userId')
      .exec();
    res.json({
      ...order._doc,
      activityLog: activities,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const filterByStatus = async (req, res) => {
  try {
    const order = await Order.find({ status: req.query.status.split(',') })
      .populate('status')
      .populate('serviceId', 'name desc price image duration status');
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getOrderByDate = async (req, res) => {
  try {
    const totalSlot = [];
    const { service, date } = req.query;
    const startDay = startOfDay(new Date(date)).toISOString();
    const endDay = endOfDay(new Date(date)).toISOString();
    const order = await Order.find({
      startDate: {
        $gte: startDay,
        $lte: endDay,
      },
      serviceId: service,
      status: { $ne: '632bc765dc2a7f68a3f383eb' },
    }).exec();
    const serviceData = await Service.findOne({ _id: service }).exec();
    serviceData.timeSlot.forEach((time) => {
      const filterOrder = order.filter(
        (item) => new Date(item.startDate).getHours() === Math.floor(time)
      );
      totalSlot.push(filterOrder.length);
    });

    res.json(totalSlot);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const convertTimeToNumber = (date) => {
  const time = new Date(date);
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const number = hours + minutes / 60;
  return Number(number.toFixed(1));
};

export const getOrderByUser = async (req, res) => {
  try {
    const { date, userPhone } = req.query;
    const startDay = startOfDay(new Date(date)).toISOString();
    const endDay = endOfDay(new Date(date)).toISOString();
    const order = await Order.find({
      startDate: {
        $gte: startDay,
        $lte: endDay,
      },
      status: {
        $ne: '632bc765dc2a7f68a3f383eb',
      },
      'infoUser.phone': userPhone,
    }).exec();
    const orderEndTime = order.map((item) => {
      const endTime = convertTimeToNumber(item.endDate);
      const startTime = convertTimeToNumber(item.startDate);
      return {
        start: startTime,
        end: endTime,
      };
    });
    res.json(orderEndTime);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getFutureOrderByStore = async (req, res) => {
  try {
    const today = startOfToday();
    const { staffId, status, search, serviceId } = req.query;

    const options = {
      ...(serviceId && {
        'servicesRegistered.service': serviceId,
      }),
      ...(staffId && { 'servicesRegistered.staff': staffId }),
      ...(status && { status }),
      ...(search && {
        ...(!isNaN(+search) && {
          'infoUser.phone': { $regex: search, $options: 'i' },
        }),
        ...(isNaN(+search) && {
          'infoUser.name': { $regex: search, $options: 'i' },
        }),
      }),
    };

    const orders = await Order.find({
      startDate: {
        $gte: today,
      },
      status: { $ne: '632bc765dc2a7f68a3f383eb' },
      ...options,
    })
      .populate({
        path: 'servicesRegistered.service',
        model: 'Service',
      })
      .populate({
        path: 'servicesRegistered.staff',
        model: 'User',
      })
      .populate('status')
      .exec();

    res.json(orders);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getOrderByStaffCategory = async (req, res) => {
  try {
    const countTimeSlot = [];

    const { serviceId, date } = req.query;

    const startDay = startOfDay(new Date(date));
    const endDay = endOfDay(new Date(date));

    const service = await Service.findOne({ _id: serviceId }).exec();

    const staffCategory = await Staff.find({
      category: service.categoryId,
    }).exec();
    const totalStaff = staffCategory.length;

    const serviceDuration = roundedNumber((service.duration + 15) / 60);
    const serviceTimeSlot = service.timeSlot;

    const orders = await Order.aggregate([
      {
        $match: {
          startDate: {
            $gte: startDay,
            $lte: endDay,
          },
          status: {
            $ne: new mongoose.Types.ObjectId('632bc765dc2a7f68a3f383eb'),
          },
        },
      },
      {
        $lookup: {
          from: 'staffs',
          foreignField: 'staff',
          localField: 'servicesRegistered.staff',
          as: 'staff',
        },
      },
      {
        $match: {
          'staff.category': new mongoose.Types.ObjectId(service.categoryId),
        },
      },
      {
        $project: {
          staff: 0,
        },
      },
    ]);

    serviceTimeSlot.forEach((item) => {
      let count = 0;
      orders.forEach((order) => {
        order.servicesRegistered.forEach((serviceItem) => {
          const orderStartTime = roundedNumber(
            dateToHourNumber(serviceItem.timeStart)
          );
          const orderEndTime = roundedNumber(
            dateToHourNumber(serviceItem.timeEnd)
          );
          if (
            (item <= orderEndTime &&
              roundedNumber(orderEndTime - serviceTimeSlot) <=
                serviceDuration) ||
            (item + serviceDuration >= orderStartTime &&
              roundedNumber(item + serviceDuration - orderStartTime) <=
                serviceDuration)
          ) {
            count++;
          }
        });
      });
      countTimeSlot.push(count);
    });

    const checkDisableTimeSlot = countTimeSlot.map(
      (item) => item === totalStaff
    );

    res.json(checkDisableTimeSlot);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getTodayOrder = async (req, res) => {
  try {
    const orders = await Order.find({
      startDate: {
        $gte: startOfToday().toISOString(),
        $lte: endOfToday().toISOString(),
      },
    }).exec();
    res.json(orders);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const searchOrder = async (req, res) => {
  try {
    const { search } = req.query;
    if (!isNaN(+search)) {
      const orders = await Order.find({
        'infoUser.phone': { $regex: search, $options: 'i' },
      }).exec();
      return res.json(orders);
    }
    const orders = await Order.find({
      'infoUser.name': { $regex: search, $options: 'i' },
    }).exec();
    res.json(orders);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getByDate = async (req, res) => {
  try {
    const { date, limit, page } = req.query;
    const pageLimit = +limit || 10;
    const pageNum = (+page - 1) * pageLimit;

    const orders = await Order.find({
      startDate: {
        $gte: startOfDay(new Date(date)).toISOString(),
        $lte: endOfDay(new Date(date)).toISOString(),
      },
    })
      .limit(pageLimit)
      .skip(pageNum)
      .exec();
    const total = await Order.countDocuments({
      startDate: {
        $gte: startOfDay(new Date(date)).toISOString(),
        $lte: endOfDay(new Date(date)).toISOString(),
      },
    }).exec();
    res.json({ total, orders });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const filterOrder = async (req, res) => {
  try {
    const {
      staffId,
      date,
      status,
      search,
      page,
      limit,
      sortField,
      sortOrder,
      serviceId,
    } = req.query;

    const pageLimit = +limit || 10;
    const pageNum = (+page - 1) * pageLimit;

    const options = {
      ...(serviceId && {
        'servicesRegistered.service': serviceId,
      }),
      ...(staffId && { 'servicesRegistered.staff': staffId }),
      ...(date && {
        startDate: {
          $gte: startOfDay(new Date(date)).toISOString(),
          $lte: endOfDay(new Date(date)).toISOString(),
        },
      }),
      ...(status && { status }),
      ...(search && {
        ...(!isNaN(+search) && {
          'infoUser.phone': { $regex: search, $options: 'i' },
        }),
        ...(isNaN(+search) && {
          'infoUser.name': { $regex: search, $options: 'i' },
        }),
      }),
    };

    const total = await Order.countDocuments(options).exec();
    const orders = await Order.find(options)
      .populate('status')
      .populate({
        path: 'servicesRegistered.service',
        model: 'Service',
        populate: {
          path: 'categoryId',
          model: 'Category',
          populate: {
            path: 'storeId',
            model: 'Store',
          },
        },
      })
      .populate({
        path: 'servicesRegistered.staff',
        model: 'User',
      })
      .populate('userId')
      .populate('voucher')
      .limit(pageLimit)
      .skip(pageNum)
      .sort([[sortField || 'createdAt', sortOrder || -1]])
      .exec();
    res.json({ total, orders });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getUserOrder = async (req, res) => {
  try {
    const userId = decode(req.token)._id;
    const { page, status } = req.query;
    const limit = 12;
    const pageSkip = (page - 1) * limit;

    const orders = await Order.find({ userId, ...(status && { status }) })
      .populate({
        path: 'servicesRegistered.service',
        model: 'Service',
      })
      .populate({
        path: 'servicesRegistered.staff',
        model: 'User',
      })
      .populate('voucher')
      .populate('status')
      .skip(pageSkip)
      .limit(limit)
      .sort([['createdAt', -1]])
      .exec();

    const total = await Order.countDocuments({
      userId,
      ...(status && { status }),
    }).exec();

    res.json({
      total,
      data: orders,
      limit,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getOrderByService = async (req, res) => {
  try {
    const { serviceId } = req.query;
    const orders = await Order.find({
      'servicesRegistered.service': serviceId,
    }).exec();
    res.json(orders);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const adminGetUserOrder = async (req, res) => {
  try {
    const { page, userId } = req.query;
    const limit = 12;
    const pageSkip = (page - 1) * limit;

    const orders = await Order.find({ userId })
      .populate({
        path: 'servicesRegistered.service',
        model: 'Service',
      })
      .populate({
        path: 'servicesRegistered.staff',
        model: 'User',
      })
      .populate('voucher')
      .populate('status')
      .skip(pageSkip)
      .limit(limit)
      .sort([['startDate', -1]])
      .exec();

    const total = await Order.countDocuments({
      userId,
    }).exec();

    res.json({
      total,
      data: orders,
      limit,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
