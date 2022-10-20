import mongoose from 'mongoose';
import { endOfDay, startOfDay } from 'date-fns';
import Staff from '../models/staff';
import Order from '../models/order';
import { dateToHourNumber } from '../utils/dateToHourNumber';
import Service from '../models/service';

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
    const staff = await Staff.find({ category: req.params.id })
      .populate('staff')
      .exec();
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

    const duration = (service.duration + 15) / 60;
    const startTime = +timeSlot;
    const endTime = +timeSlot + duration;

    for (let i = 0; i < order.length; i++) {
      const orderStartTime = dateToHourNumber(order[i].startDate);
      const orderEndTime = dateToHourNumber(order[i].endDate);
      if (
        (orderEndTime > startTime && orderEndTime - startTime <= duration) ||
        (orderStartTime < endTime && endTime - orderStartTime <= duration)
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
