import Category from '../models/category';
import Service from '../models/service';
// eslint-disable-next-line import/order
// eslint-disable-next-line import/prefer-default-export
export const create = async (request, response) => {
  try {
    const category = await new Category(request.body).save();
    response.json(category);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
export const list = async (request, response) => {
  try {
    const category = await Category.find();
    response.json(category);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
export const read = async (request, response) => {
  const condition = { _id: request.params.id };
  try {
    const category = await Category.findOne(condition).exec();
    const services = await Service.find({ category })
      .populate('categoryId')
      .select('-categoryId')
      .exec();
    response.json({
      ...category._doc,
      services,
    });
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
    const category = await Category.findOneAndDelete(condition).exec();
    response.json(category);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

export const update = async (request, response) => {
  const option = { new: true };
  try {
    const category = await Category.findOneAndUpdate(
      { _id: request.params.id },
      request.body,
      option
    ).exec();
    response.json(category);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const searchCate = async (req, res) => {
  const searchString = req.query.q ? req.query.q : '';

  const result = await Category.find({
    $text: { $search: searchString },
  }).exec();
  res.json(result);
};
