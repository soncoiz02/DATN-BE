import UserNotify from '../models/usernotify';

// eslint-disable-next-line import/prefer-default-export
export const create = async (request, response) => {
  try {
    const userNotify = await new UserNotify(request.body).save();
    response.json(userNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
    console.log(error);
  }
};
export const list = async (request, response) => {
  try {
    const userNotify = await UserNotify.find({}).exec();
    response.json(userNotify);
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
      { id: request.params.id },
      request.body,
      option
    ).exec();
    response.json(userNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
