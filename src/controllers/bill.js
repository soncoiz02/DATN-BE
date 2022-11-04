import nodemailer from 'nodemailer';
import Bill from '../models/bill';
import Order from '../models/order';
import ActivityLog from '../models/activityLog';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'beautyparadise1102@gmail.com',
    pass: 'soncoiz02',
    clientId:
      '703579968493-uticdlqnqmbm6p2q8lg4r4f86987qlec.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken:
      '1//046in42HmOhR1CgYIARAAGAQSNwF-L9Ir5birfMVNKhnODN2AEJB6sN7sy6HgysnSG9UsBm5XMSJWa-8FvEDUIdG_8XtFEKgqz0Q',
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
    // const bill = await new Bill(billData).save();
    const newOrder = await Order.findOneAndUpdate(
      { _id: billData.order },
      { status: '634e59b757b7ea792917962c' }
    ).exec();
    await new ActivityLog(activityLog).save();
    // transporter.sendMail(emailOption, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log(`Email sent: ${info.response}`);
    //   }
    // });
    res.json(newOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
