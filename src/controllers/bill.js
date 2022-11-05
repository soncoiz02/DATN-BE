import ActivityLog from '../models/activityLog';
import Bill from '../models/bill';
import Order from '../models/order';
import sendEmail from '../utils/sendEmail';

// eslint-disable-next-line import/prefer-default-export
export const getAll = async (req, res) => {
  try {
    const bills = await Bill.find().exec();
    res.json(bills);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id }).exec();
    res.json(bill);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const { billData, activityLog, emailOption } = req.body;
    // const bill = await new Bill(billData).save();
    const newOrder = await Order.findOneAndUpdate(
      { _id: billData.order },
      { status: '634e59b757b7ea792917962c' }
    ).exec();
    await new ActivityLog(activityLog).save();
    sendEmail(emailOption);
    res.json(newOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
