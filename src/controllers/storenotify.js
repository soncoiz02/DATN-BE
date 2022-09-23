import StoreNotify from '../models/storenotify';

// eslint-disable-next-line import/prefer-default-export
export const create = async (request, response) => {
  try {
    const storeNotify = await new StoreNotify(request.body).save();
    response.json(storeNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
    console.log(error);
  }
};
export const list = async (request, response) => {
  try {
    const storeNotify = await StoreNotify.find({}).exec();
    response.json(storeNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const read = async (request, response) => {
  try {
    const storeNotify = await StoreNotify.findOne({
      _id: request.params.id,
    }).populate('userId', 'username email');
    response.json(storeNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const remove = async (request, response) => {
  try {
    const storeNotify = await StoreNotify.findOneAndDelete({
      _id: request.params.id,
    }).exec();
    response.json(storeNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const updateStore = async (request, response) => {
  const option = { new: true };
  try {
    const storeNotify = await StoreNotify.findOneAndUpdate(
      { id: request.params.id },
      request.body,
      option
    ).exec();
    response.json(storeNotify);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
