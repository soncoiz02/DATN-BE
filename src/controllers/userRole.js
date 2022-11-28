import UserRole from '../models/userRole';

// eslint-disable-next-line import/prefer-default-export
export const create = async (request, response) => {
  try {
    const userRole = await new UserRole(request.body).save();
    response.json(userRole);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
export const list = async (request, response) => {
  try {
    const userRole = await UserRole.find({}).exec();
    response.json(userRole);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const update = async (request, response) => {
  try {
    const userRole = await UserRole.findOneAndUpdate(
      { _id: request.params.id },
      request.body,
      { new: true }
    );
    response.json(userRole);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const remove = async (request, response) => {
  try {
    const userRole = await UserRole.findOneAndDelete({
      _id: request.params.id,
    }).exec();
    response.json(userRole);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
