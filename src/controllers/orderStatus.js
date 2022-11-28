import OrderStatus from '../models/orderStatus';
// eslint-disable-next-line import/prefer-default-export
export const create = async (request, response) => {
  try {
    const orderStatus = await new OrderStatus(request.body).save();
    response.json(orderStatus);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
export const list = async (request, response) => {
  try {
    const orderStatus = await OrderStatus.find();
    response.json(orderStatus);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
export const read = async (request, response) => {
  const condition = { _id: request.params.id };
  try {
    const orderStatus = await OrderStatus.findOne(condition).exec();
    response.json(orderStatus);
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
    const orderStatus = await OrderStatus.findOneAndDelete(condition).exec();
    response.json(orderStatus);
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
    const orderStatus = await OrderStatus.findOneAndUpdate(
      { _id: request.params.id },
      document,
      options
    ).exec();
    response.json(orderStatus);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
