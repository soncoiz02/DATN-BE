import Post from '../models/post';
// eslint-disable-next-line import/prefer-default-export
export const create = async (request, response) => {
  try {
    const post = await new Post(request.body).save();
    response.json(post);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
export const list = async (request, response) => {
  try {
    const post = await Post.find();
    response.json(post);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
export const read = async (request, response) => {
  const condition = { _id: request.params.id };
  try {
    const post = await Post.findOne(condition).exec();
    response.json(post);
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
    const post = await Post.findOneAndDelete(condition).exec();
    response.json(post);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

export const update = async (request, response) => {
  const document = request.body;
  const options = { new: true };
  try {
    const post = await Post.findOneAndUpdate(
      { _id: request.params.id },
      document,
      options
    ).exec();
    response.json(post);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
