import { decode } from 'jsonwebtoken';
import UserNotify from '../models/usernotify';
import { sort } from './service';

// eslint-disable-next-line import/prefer-default-export
export const create = async (request, response) => {
  try {
    const userNotify = await new UserNotify(request.body).save();
    response.json(userNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const list = async (request, response) => {
  try {
    const userId = decode(request.token)._id;
    const { page } = request.query;
    const limit = 10 * page;
    const userNotify = await UserNotify.find({ userId })
      .limit(limit)
      .sort([['createdAt', -1]])
      .exec();
    const total = await UserNotify.countDocuments({ userId }).exec();
    const totalUnread = await UserNotify.count({ userId, status: 0 }).exec();
    response.json({
      total,
      totalUnread,
      data: userNotify,
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const read = async (request, response) => {
  try {
    const userNotify = await UserNotify.findOne({
      _id: request.params.id,
    })
      .populate('userId', 'username email')
      .exec();
    response.json(userNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const remove = async (request, response) => {
  try {
    const userNotify = await UserNotify.findOneAndDelete({
      _id: request.params.id,
    }).exec();
    response.json(userNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const update = async (request, response) => {
  const option = { new: true };
  try {
    const userNotify = await UserNotify.findOneAndUpdate(
      { _id: request.params.id },
      request.body,
      option
    ).exec();
    response.json(userNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

export const staffNotify = async (req, res) => {
  try {
    const staffId = decode(req.token)._id;
    const { page } = req.query;
    const limit = 10 * page;
    const notify = await UserNotify.find({ userId: staffId })
      .limit(limit)
      .sort([['createdAt', -1]])
      .exec();
    const total = await UserNotify.countDocuments({ userId: staffId }).exec();
    const totalUnread = await UserNotify.countDocuments({
      userId: staffId,
      status: 0,
    }).exec();
    res.json({
      total,
      totalUnread,
      data: notify,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
