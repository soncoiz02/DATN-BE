import { createHmac } from 'crypto';
import { decode } from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user';
import sendEmail from '../utils/sendEmail';

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
export const updateUser = async (req, res) => {
  try {
    const userId = decode(req.token)._id;
    const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true,
    })
      .populate('roleId', 'name')
      .exec();
    res.json({
      username: user.username,
      name: user.name,
      birthday: user.birthday,
      phone: user.phone,
      email: user.email,
      avt: user.avt,
      roleId: user.roleId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

export const changePassword = async (req, res) => {
  try {
    const userId = decode(req.token)._id;
    const { newPassword, currentPassword } = req.body.password;
    const user = await User.findOne({ _id: userId }).exec();

    if (!user.authenticate(currentPassword)) {
      return res.status(400).json({
        message: 'Mật khẩu cũ không đúng',
      });
    }

    const hashPassword = createHmac('Sha256', 'abc')
      .update(newPassword)
      .digest('hex');
    await User.findOneAndUpdate(
      { _id: userId },
      { password: hashPassword },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getVerifyCode = async (req, res) => {
  try {
    const { email } = req.body;
    const randomNum = Math.floor(Math.random() * 1000);

    let code = '';

    if (randomNum < 1000 && randomNum >= 100) {
      code = `0${randomNum}`;
    } else if (randomNum >= 10) {
      code = `00${randomNum}`;
    } else if (randomNum >= 0) {
      code = `000${randomNum}`;
    } else {
      code = randomNum;
    }

    const htmlTemplate = `
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 570px;
        background-color: #fff;
        margin: 0 auto;
        padding: 30px;
      "
    >
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
          >
            <tr>
              <td>
              <div style="border-radius: 50%; width: 50px; height: 50px; overflow: hidden; margin: 0 auto;">
                    <img src="https://res.cloudinary.com/deqhqs09b/image/upload/v1667559552/hq5qjqy4esmdfyvxxkqr.png" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              </td>
            </tr>
            <tr>
              <td cellpadding="0" cellspacing="0">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                    line-height: 22px;
                  "
                >
                  <tr>
                    <td>
                      <h2 style="text-align: center; color: #ff6073;">
                        Beauty Paradise
                      </h2>
                      <h3 style="text-align: center;">
                        Gửi bạn mã xác nhận
                      </h3>
                      <p
                        style="
                          font-size: 50px;
                          font-weight: bold;
                          letter-spacing: 3px;
                          padding: 15px 25px;
                          background: #ff6073;
                          color: white;
                          text-align: center;
                          width: 200px;
                          margin: 0 auto;
                        "
                      >
                        ${code}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    `;

    const emailOption = {
      from: 'beautyparadise1102@gmail.com',
      to: email,
      subject: `Beauty Paradise gửi bạn mã xác nhận.`,
      html: htmlTemplate,
    };

    sendEmail(emailOption);

    res.json(code);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
