import Jwt from 'jsonwebtoken';
import StoreMemberShip from '../models/storeMemberShip';
import User from '../models/user';
// eslint-disable-next-line import/prefer-default-export, consistent-return
export const register = async (request, response) => {
  const { email, username, password, birthday, phone, name, avt, roleId } =
    request.body;
  try {
    const exitUser = await User.findOne({ username }).exec();
    const existEmail = await User.findOne({ email }).exec();
    const existPhone = await User.findOne({ phone }).exec();
    if (exitUser) {
      return response.status(400).json({
        field: 'username',
        message: 'Tài khoản đã tồn tại',
      });
    }
    if (existEmail) {
      return response.status(400).json({
        field: 'email',
        message: 'Email đã được đăng ký',
      });
    }
    if (existPhone) {
      return response.status(400).json({
        field: 'phone',
        message: 'Số điện thoại đã được đăng ký',
      });
    }
    const user = await new User({
      email,
      username,
      password,
      birthday,
      phone,
      name,
      avt,
      // db mới đăng ký khách hàng
    }).save();
    const token = Jwt.sign({ _id: user.id }, '123456', {
      expiresIn: 60 * 60 * 24,
    });
    response.json({
      token,
      user: {
        _id: user.id,
        username: user.username,
        name: user.name,
        birthday: user.birthday,
        phone: user.phone,
        email: user.email,
        avt: user.avt,
        roleId: user.roleId,
      },
    });
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
// eslint-disable-next-line consistent-return
export const login = async (request, response) => {
  const { username, password } = request.body;
  try {
    const user = await User.findOne({ username }).populate('roleId').exec();
    if (!user) {
      return response.status(400).json({
        field: 'username',
        message: 'Sai tên đăng nhập',
      });
    }
    if (!user.authenticate(password)) {
      return response.status(400).json({
        field: 'password',
        message: 'Sai mật khẩu',
      });
    }
    const token = Jwt.sign({ _id: user.id }, '123456', {
      expiresIn: 60 * 60 * 24,
    });

    const userData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      birthday: user.birthday,
      phone: user.phone,
      email: user.email,
      avt: user.avt,
      roleId: user.roleId,
    };

    if (user.roleId.name === 'Admin' || user.roleId.name === 'Staff') {
      const storeMember = await StoreMemberShip.findOne({
        userId: user._id,
      }).exec();
      return response.json({
        token,
        user: {
          ...userData,
          storeId: storeMember.storeId,
        },
      });
    }
    response.json({
      token,
      user: userData,
    });
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
