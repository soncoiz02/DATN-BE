import ServiceRating from "../models/serviceRating";

// eslint-disable-next-line import/prefer-default-export
export const createServeRating = (req, res) => {
    try {
        const serviceRating = new ServiceRating(req.body).save();
        res.json(serviceRating);
    } catch (error) {
        res.status(400).json({
            message: "Thêm đánh giá không thành công",
        })
    }
}

export const listServeRating = async(req, res) => {
    try {
        const serviceRating = await ServiceRating.find({}).exec();
        res.json(serviceRating);
    } catch (error) {
        res.status(400).json({
            message: "Không hiển thị được danh sách đánh giá dịch vụ",
        })
    }
}

export const removeServeRating = async(req, res) => {
    try {
        const serviceRating = await ServiceRating.findOneAndDelete({ _id: req.params.id }).exec();
        res.json(serviceRating);
    } catch (error) {
        res.status(400).json({
            message: "Xóa đánh giá dịch vụ không thành công",
        })
    }
}

export const updateServeRating = async(req, res) => {
    try {
        const serviceRating = await ServiceRating.findOneAndUpdate({ _id: req.params.id }, req.body).exec();
        res.json(serviceRating);
    } catch (error) {
        res.status(400).json({
            message: "Sửa đánh giá dịch vụ không thành công",
        })
    }
}

export const readServeRating = async(req, res) => {
    try {
        const serviceRating = await ServiceRating.findOne({ _id: req.params.id }).exec();
        res.json(serviceRating);
    } catch (error) {
        res.status(400).json({
            message: "Không tìm được đánh giá dịch vụ",
        })
    }
}