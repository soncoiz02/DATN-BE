import Category from '../model/category'
// eslint-disable-next-line import/prefer-default-export
export const create = async (request, response) => {
    try {
        const category = await new Category(request.body).save()
        response.json(category)
    } catch (error) {
        response(400).json({
            message: "Không thêm được danh mục"
        })
    }
}
export const list = async (request, response) => {
    try {
        const category = await Category.find()
        response.json(category);
    } catch (error) {
        response(400).json({
            message: "Không tìm thấy danh mục"
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
        response(400).json({
            message: "Không tìm được danh mục"
        })
    }
}
export const remove = async (request, response) => {
    const condition = { _id: request.params.id };
    try {
        const category = await Category.findOneAndDelete(condition).exec();
        response.json(category)
    } catch (error) {
        response(400).json({
            message: "Xóa danh mục thất bại"
        })
    }
}
export const update = async (request, response) => {
    const condition = { _id: request.params.id };
    const document = request.body;
    const options = { new: true }
    try {
        const category = await Category.findOneAndUpdate(condition, document, options).exec();
        response.json(category)
    } catch (error) {
        response(400).json({
            message: "Cập nhật danh mục thất bại"
        })
    }
}