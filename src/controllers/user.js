import User from '../models/user';
// eslint-disable-next-line consistent-return
export const GetoneUser = async (request, response) => {
  const condition = { _id: request.params.id };
  try {
    const user = await User.findOne(condition).exec();
    response.json({
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(400).json({
      message: error.message,
    });
  }
};
export const listUser = async (req, response) => {
  try {
    const user = await User.find().sort({ createAt: -1 });

    return response.json(user);
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
  const options = { new: true };
  try {
    const user = await User.findOneAndUpdate(
      { id: request.params.id },
      request.body,
      options
    ).exec();
    response.json(user);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
  // products.map(item => item.id === +request.params.id ? request.body : item)
};
