import Postcomment from '../models/postcomment';
// eslint-disable-next-line import/prefer-default-export
export const create = async (request, response) => {
  try {
    const postComment = await new Postcomment(request.body).save();
    response.json(postComment);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
export const list = async (request, response) => {
  try {
    const postComment = await Postcomment.find();
    response.json(postComment);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
export const read = async (request, response) => {
  const condition = { _id: request.params.id };
  try {
    const postComment = await Postcomment.findOne(condition).exec();
    response.json(postComment);
  } catch (error) {
    console.log(error);
    response.status(400).json({
      message: error.message,
    });
  }
};
export const remove = async (request, response) => {
  const condition = { _id: request.params.id };
  try {
    const postComment = await Postcomment.findOneAndDelete(condition).exec();
    response.json(postComment);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

export const update = async (request, response) => {
  const condition = { _id: request.params.id };
  const document = request.body;
  const options = { new: true };
  try {
    const postComment = await Postcomment.findOneAndUpdate(
      condition,
      document,
      options
    ).exec();
    response.json(postComment);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
