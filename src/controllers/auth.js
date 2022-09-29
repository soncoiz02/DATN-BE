import Jwt from 'jsonwebtoken';
import User from '../models/user';
// eslint-disable-next-line import/prefer-default-export, consistent-return
export const register = async (request, response) => {
  const { email, username, password } = request.body;
  try {
    const exitUser = await User.findOne({ email }).exec();
    if (exitUser) {
      return response.status(400).json({
        message: 'Email existed',
      });
    }
    const user = await new User({ email, username, password }).save();
    response.json({
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
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
  const { email, password } = request.body;
  try {
    const user = await User.findOne({ email }).exec();
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
    const token = Jwt.sign({ _id: user.id }, '123456', { expiresIn: 60 * 60 });
    response.json({
      token,
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
