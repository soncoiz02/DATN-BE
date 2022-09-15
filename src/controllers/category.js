import Category from '../models/category'
// eslint-disable-next-line import/order
import slugify from 'slugify'
// eslint-disable-next-line import/prefer-default-export
export const create = async (request, response) => {
    request.body.slug = slugify(request.body.name)
    try {
        const category = await new Category(request.body).save()
        response.json(category)
    } catch (error) {
        response.status(400).json({
            message: error.message
        })
    }
}
export const list = async (request, response) => {
    try {
        const category = await Category.find()
        response.json(category);
    } catch (error) {
        response.status(400).json({
            message: error.message
        })
    }
}
export const read = async (request, response) => {
    const condition = { _id: request.params.id }
    try {
        const category = await Category.findOne(condition).exec();
        response.json({
            category,
        })
    } catch (error) {
        console.log(error)
        response.status(400).json({
            message: error.message
        })
    }
}
export const remove = async (request, response) => {
    const condition = { _id: request.params.id };
    try {
        const category = await Category.findOneAndDelete(condition).exec();
        response.json(category)
    } catch (error) {
        response.status(400).json({
            message: error.message
        })
    }
}
export const update = async (request, response) => {
    const condition = { slug: request.params.slug };
    request.body.slug = slugify(request.body.name)
    const document = request.body;
    const options = { new: true }
    try {
        const category = await Category.findOneAndUpdate(condition, document, options).exec();
        response.json(category)
    } catch (error) {
        response.status(400).json({
            message: error.message
        })
    }
}

