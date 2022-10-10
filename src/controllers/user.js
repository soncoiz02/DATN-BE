import mongoose from 'mongoose';
import User from '../models/user';
import StoreMemberShip from '../models/storeMemberShip';

// eslint-disable-next-line import/prefer-default-export
export const GetoneUser = async (request, response) => {
  const condition = { _id: request.params.id };
  try {
    const user = await User.findOne(condition)
      .populate('roleId', 'name')
      .exec();
    response.json({
      username: user.username,
      name: user.name,
      birthday: user.birthday,
      phone: user.phone,
      email: user.email,
      avt: user.avt,
      roleId: user.roleId,
    });
  } catch (error) {
    console.log(error);
    response.status(400).json({
      message: error.message,
    });
  }
};
// eslint-disable-next-line consistent-return
export const listUser = async (req, response) => {
  try {
    const user = await User.find({}, 'username name birthday phone email avt ')
      .sort({ createAt: -1 })
      .populate('roleId', 'name')
      .exec();
    response.json(user);
  } catch (error) {
    return response.status(400).json({
      message: error.message,
    });
  }
};
// eslint-disable-next-line import/prefer-default-export
export const removeUser = async (request, response) => {
  const filter = { _id: request.params.id };
  try {
    const user = await User.findOneAndDelete(filter);
    response.json({
      message: 'Đã xóa thành công',
      data: user,
    });
  } catch (error) {
    response.status(400).json({ message: 'Không thể xóa' });
  }
};
export const updateUser = async (request, response) => {
  const option = { new: true };
  try {
    const user = await User.findOneAndUpdate(
      { id: request.params.id },
      request.body,
      option
    )
      .populate('roleId', 'name')
      .exec();
    response.json({
      username: user.username,
      name: user.name,
      birthday: user.birthday,
      phone: user.phone,
      email: user.email,
      avt: user.avt,
      roleId: user.roleId,
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const createRoleUser = async (request, response) => {
  try {
    const user = await new User(request.body.roleId).save();
    response.json(user);
  } catch (error) {
    response.status(400).json({ message: error.message });
    console.log(error);
  }
};

export const getStoreStaff = async (req, res) => {
  try {
    const storeId = req.params.id;
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'storememberships',
          localField: '_id',
          foreignField: 'userId',
          as: 'storeMember',
        },
      },
      {
        $match: {
          'storeMember.storeId': new mongoose.Types.ObjectId(storeId),
          roleId: new mongoose.Types.ObjectId('6336719e9f0cdce7e66cba16'),
        },
      },
      {
        $project: {
          storeMember: 0,
        },
      },
    ]);
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};
