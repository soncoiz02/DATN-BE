import Jwt from 'jsonwebtoken';
import User from '../models/user';
// eslint-disable-next-line import/prefer-default-export, consistent-return
export const register = async (request, response) => {
  const { email, username, password, birthday, phone, name, avt } =
    request.body;
  console.log(request.body);
  try {
    const exitUser = await User.findOne({ username }).exec();
    if (exitUser) {
      return response.status(400).json({
        message: 'Account existed',
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
    }).save();
    response.json({
      user: {
        _id: user.id,
        username: user.username,
        name: user.name,
        birthday: user.birthday,
        phone: user.phone,
        email: user.email,
        avt: user.avt,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(400).json({
      message: error.message,
    });
  }
};
// eslint-disable-next-line consistent-return
export const login = async (request, response) => {
  const { username, password } = request.body;
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return response.status(400).json({
        message: 'User does not exist',
      });
    }
    if (!user.authenticate(password)) {
      return response.status(400).json({
        message: 'Password is wrong',
      });
    }
    const token = Jwt.sign({ _id: user.id }, '123456', {
      expiresIn: 60 * 60 * 24,
    });
    response.json({
      token,
      user: {
        name: user.name,
        username: user.username,
        birthday: user.birthday,
        phone: user.phone,
        email: user.email,
        avt: user.avt,
      },
    });
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
