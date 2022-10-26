import mongoose from 'mongoose';
import { endOfDay, startOfDay } from 'date-fns';
import Staff from '../models/staff';
import Order from '../models/order';
import { dateToHourNumber } from '../utils/dateToHourNumber';
import Service from '../models/service';
import User from '../models/user';
import roundedNumber from '../utils/roundedNumber';

export const createStaff = async (req, res) => {
  try {
    const staff = await new Staff(req.body).save();
    res.json(staff);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const staffs = await Staff.find({}).exec();
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
    const { timeSlot, date } = req.query;
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
        const order = await Order.aggregate([
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
              localField: 'serviceId',
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
        ]);
        return order;
      } catch (error) {
        res.status(400).json({
          message: error.message,
        });
      }
    };

    const orderOfStore = await Promise.all(
      services.map((service) => getOrders(service))
    );

    // const order = await Order.aggregate([
    //   {
    //     $match: {
    //       startDate: {
    //         $gte: startOfDate,
    //         $lte: endOfDate,
    //       },
    //       status: {
    //         $ne: '632bc765dc2a7f68a3f383eb'
    //       }
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'services',
    //       foreignField: '_id',
    //       localField: 'serviceId',
    //       as: 'service',
    //     },
    //   },
    //   {
    //     $match: {
    //       'service.categoryId': new mongoose.Types.ObjectId(service.categoryId),
    //     },
    //   },
    //   {
    //     $project: {
    //       service: 0,
    //     },
    //   },
    // ]);

    const listStaffOfService = [];

    orderOfStore.forEach((order) => {
      const listStaff = [];
      if (order.length === 0) listStaffOfService.push(0);

      for (let i = 0; i < order.length; i++) {
        const duration = roundedNumber(
          (order[i].service[0].duration + 15) / 60
        );
        const startTime = +timeSlot;
        const endTime = +timeSlot + duration;

        const orderStartTime = roundedNumber(
          dateToHourNumber(order[i].startDate)
        );
        const orderEndTime = roundedNumber(dateToHourNumber(order[i].endDate));

        console.log({
          duration,
          startTime,
          endTime,
          orderStartTime,
          orderEndTime,
        });

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

      listStaffOfService.push(listStaff.length);
    });

    // lấy tổng số nv ra check

    res.json({ orderOfStore, listStaffOfService });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
