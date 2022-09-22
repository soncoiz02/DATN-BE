import User from '../models/user';

// eslint-disable-next-line import/prefer-default-export
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
