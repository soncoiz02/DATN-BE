import { endOfDay, startOfDay, startOfToday } from 'date-fns';
import Order from '../models/order';
import Service from '../models/service';
import User from '../models/user';

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
    const { service, date, userPhone } = req.query;
    const startDay = startOfDay(new Date(date)).toISOString();
    const endDay = endOfDay(new Date(date)).toISOString();
    const order = await Order.find({
      startDate: {
        $gte: startDay,
        $lte: endDay,
      },
      serviceId: service,
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

export const getFutureOrder = async (req, res) => {
  try {
    const today = startOfToday().toISOString();
    const order = Order.find({
      startDate: {
        $gte: today,
      },
      status: { $ne: '632bc765dc2a7f68a3f383eb' },
    }).exec();
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
