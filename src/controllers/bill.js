import nodemailer from 'nodemailer';
import Bill from '../models/bill';
import Order from '../models/order';
import ActivityLog from '../models/activityLog';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'soncoiz3107@gmail.com',
    pass: 'Soncoiz02!',
    clientId:
      '703579968493-uticdlqnqmbm6p2q8lg4r4f86987qlec.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken:
      '1//04B1dUeTUbbSLCgYIARAAGAQSNwF-L9IraCqNPpRlg4xqXi9c4ucq9IB1dDyFKktslxW1ebHKGZzQJPkf6LMcrSKEzXs-U9rbqWE',
  },
});

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
    const bill = await new Bill(billData).save();
    await Order.findOneAndUpdate(
      { _id: billData.order },
      { status: '634e59b757b7ea792917962c' }
    ).exec();
    await new ActivityLog(activityLog).save();
    transporter.sendMail(emailOption, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
    res.json(bill);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
