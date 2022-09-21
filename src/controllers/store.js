import Store from '../models/store';
import Category from '../models/category';
// eslint-disable-next-line import/prefer-default-export
export const createStore = async (request, response) => {
  try {
    const store = await new Store(request.body).save();
    response.json(store);
  } catch (error) {
    response.status(400).json({ message: error.message });
    console.log(error);
  }
};
export const listStore = async (request, response) => {
  try {
    const store = await Store.find({}).exec();
    response.json(store);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const storeDetail = async (request, response) => {
  try {
    const store = await Store.findOne({ _id: request.params.id })
      .select('-storeId')
      .exec();
    const category = await Category.findOne({
      storeId: request.params.id,
    }).exec();
    console.log(category);
    response.json({
      // eslint-disable-next-line no-underscore-dangle
      ...store._doc,
      // eslint-disable-next-line no-underscore-dangle
      category: category._doc,
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const deleteStore = async (request, response) => {
  try {
    const store = await Store.findOneAndDelete({
      _id: request.params.id,
    }).exec();
    response.json(store);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const updateStore = async (request, response) => {
  const option = { new: true };
  try {
    const store = await Store.findOneAndUpdate(
      { id: request.params.id },
      request.body,
      option
    ).exec();
    response.json(store);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
