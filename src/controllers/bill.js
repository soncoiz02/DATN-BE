// eslint-disable-next-line import/no-cycle
import { io } from '../../index';
import ActivityLog from '../models/activityLog';
import Bill from '../models/bill';
import Order from '../models/order';
import Voucher from '../models/voucher';
import { createUserNotify } from '../socket/controller';
import getVoucherDiscount from '../utils/getVoucherDiscount';
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
    const newOrder = await Order.findOneAndUpdate(
      { _id: billData.order },
      { status: '634e59b757b7ea792917962c' }
    ).exec();
    await new ActivityLog(activityLog).save();
    sendEmail(emailOption);

    const { userId } = newOrder;

    const totalUserOrderDone = await Order.countDocuments({
      userId,
      status: '634e59b757b7ea792917962c',
    }).exec();
    let voucher;
    if (totalUserOrderDone === 10) {
      voucher = getVoucherDiscount(10, 10, userId);
    } else if (totalUserOrderDone === 20) {
      voucher = getVoucherDiscount(20, 20, userId);
    }

    if (voucher) {
      await new Voucher(voucher).save();

      const notify = {
        userId: voucher.userId,
        storeId: voucher.storeId,
        content: `Bạn nhận được ${voucher.title}`,
      };

      const newNotify = await createUserNotify(notify);
      io.emit('receive-user-notify', newNotify);
    }
    res.json(newOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
