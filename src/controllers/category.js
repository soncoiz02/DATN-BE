import Category from '../models/category';
import Service from '../models/service';
// eslint-disable-next-line import/order
import slugify from 'slugify';
// eslint-disable-next-line import/order
// eslint-disable-next-line import/prefer-default-export

export const create = async (request, response) => {
  request.body.slug = slugify(request.body.name);
  try {
    // console.log(request.body.name)
    const _category = await Category.findOne({
      name: request.body.name,
    }).exec();
    if (_category !== null) {
      return response.status(400).json({
        message: 'Category name existed !!!',
      });
    }

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
    const { client } = request.query;
    if (client) {
      const category = await Category.find({
        status: 1,
        _id: { $ne: '63518497a3ca43d2916000cc' },
      }).exec();
      return response.json(category);
    }
    const category = await Category.find().exec();
    response.json(category);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
export const read = async (request, response) => {
  try {
    const category = await Category.findOne({ _id: request.params.id }).exec();
    response.json(category);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

export const getBySlug = async (req, res) => {
  try {
    const condition = { slug: req.params.slug };
    const category = await Category.findOne(condition).exec();
    res.json(category);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (request, response) => {
  try {
    const category = await Service.updateMany(
      { categoryId: request.params.id },
      { $set: { categoryId: '63518497a3ca43d2916000cc' } },
      { multi: true }
    );
    await Category.deleteOne({ _id: request.params.id });
    response.json(category);
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
  request.body.slug = slugify(request.body.name);

  try {
    const category = await Category.findOneAndUpdate(
      { _id: request.params.id },
      request.body,
      options
    ).exec();
    response.json(category);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

export const searchCate = async (req, res) => {
  const searchString = req.query.q ? req.query.q : '';

  const result = await Category.find({
    $text: { $search: searchString },
  }).exec();
  res.json(result);
};
