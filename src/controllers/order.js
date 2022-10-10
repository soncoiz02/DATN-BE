import { endOfDay, startOfDay, startOfToday } from 'date-fns';
import mongoose from 'mongoose';
import Order from '../models/order';
import Service from '../models/service';
import Staff from '../models/staff';

// eslint-disable-next-line import/prefer-default-export
export const create = async (req, res) => {
  try {
    const order = await new Order(req.body).save();
    // eslint-disable-next-line no-underscore-dangle
    const detailOrder = await Order.findById(order._id)
      .populate('status')
      .populate('serviceId', 'name desc price image duration status')
      .exec();
    res.json(detailOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const list = async (req, res) => {
  try {
    const order = await Order.find({})
      .populate('status')
      .populate('serviceId', 'name desc price image duration status');
    res.json(order);
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
      .populate('serviceId', 'name desc price image duration status')
      .exec();
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const filterByStatus = async (req, res) => {
  // let filter = {}
  // if (req.query.status) {
  //     // eslint-disable-next-line no-unused-vars
  //     filter = { status: req.query.status.split(',') }
  // }

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
      status: { $ne: '632bc765dc2a7f68a3f383eb' },
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
    const storeId = req.params.id;
    const today = startOfToday().toISOString();
    const order = await Order.aggregate([
      {
        $lookup: {
          from: 'services',
          foreignField: '_id',
          localField: 'serviceId',
          as: 'services',
        },
      },
      {
        $lookup: {
          from: 'categories',
          foreignField: '_id',
          localField: 'services.categoryId',
          as: 'categories',
        },
      },
      {
        $lookup: {
          from: 'stores',
          foreignField: '_id',
          localField: 'categories.storeId',
          as: 'stores',
        },
      },
      {
        $match: {
          'stores._id': new mongoose.Types.ObjectId(storeId),
          // startDate: {
          //   $gte: today
          // },
          status: { $ne: '632bc765dc2a7f68a3f383eb' },
        },
      },
      {
        $project: {
          stores: 0,
          categories: 0,
          services: 0,
        },
      },
    ]);
    // const order = Order.find({
    //   startDate: {
    //     $gte: today,
    //   },
    //   status: { $ne: '632bc765dc2a7f68a3f383eb' },
    // }).exec();
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getOrderByStaffCategory = async (req, res) => {
  try {
    const countTimeSlot = [];
    const serviceDuration = (60 + 15) / 60;

    const { categoryId, serviceId, date } = req.query;

    const startDay = startOfDay(new Date(date));
    const endDay = endOfDay(new Date(date));

    const staffCategory = await Staff.find({ category: categoryId }).exec();
    const totalStaff = staffCategory.length;

    const services = await Service.findOne({ _id: serviceId }).exec();
    const serviceTimeSlot = services.timeSlot;

    const order = await Order.aggregate([
      {
        $match: {
          startDate: {
            $gte: startDay,
            $lte: endDay,
          },
        },
      },
      {
        $lookup: {
          from: 'staffs',
          foreignField: 'staff',
          localField: 'staff',
          as: 'staff',
        },
      },
      {
        $match: {
          'staff.category': new mongoose.Types.ObjectId(categoryId),
        },
      },
      {
        $project: {
          staff: 0,
        },
      },
    ]);

    for (let i = 0; i < serviceTimeSlot.length; i++) {
      let count = 0;
      for (let j = 0; j < order.length; j++) {
        const orderStartDate = new Date(order[j].startDate);
        const orderEndDate = new Date(order[j].endDate);

        const orderStartHour = orderStartDate.getHours();
        const orderStartMinute = orderStartDate.getMinutes();

        const orderEndHour = orderEndDate.getHours();
        const orderEndMinute = orderEndDate.getMinutes();

        const orderStartTime = orderStartHour + orderStartMinute / 60;
        const orderEndTime = orderEndHour + orderEndMinute / 60;

        // console.log({ timeSlot: serviceTimeSlot[i], orderStartTime, orderEndTime });

        if (
          (serviceTimeSlot[i] <= orderEndTime &&
            orderEndTime - serviceTimeSlot <= serviceDuration) ||
          (serviceTimeSlot[i] >= orderStartTime &&
            serviceTimeSlot[i] - orderStartTime <= serviceDuration)
        ) {
          count++;
        }
      }
      countTimeSlot.push(count);
    }

    console.log(countTimeSlot);

    const checkDisableTimeSlot = countTimeSlot.map(
      (item) => item === totalStaff
    );

    res.json(checkDisableTimeSlot);
  } catch (error) {
    console.log(error);
  }
};
