import Service from "../models/service";

// eslint-disable-next-line import/prefer-default-export
export const create = (req, res) => {

    try {
        const service = new Service(req.body).save();
        res.json(service);
        return;
    } catch (error) {
        res.status(400).json({
            message: "Thêm dịch vụ không thành công",
        })
    }
}

export const list = async(req, res) => {
    try {
        const service = await Service.find({}).exec();
        res.json(service);
    } catch (error) {
        res.status(400).json({
            message: "không hiển thị được danh sách sản phẩm",
        })
    }
}

export const remove = async(req, res) => {
    try {
        const service = await Service.findOneAndDelete({ _id: req.params.id }).exec();
        res.json(service);
    } catch (error) {
        res.status(400).json({
            message: "xóa sản phẩm không thành công",
        })
    }
}

export const update = async(req, res) => {
    try {
        const service = await Service.findOneAndUpdate({ _id: req.params.id }, req.body).exec();
        res.json(service);
    } catch (error) {
        res.status(400).json({
            message: "sửa sản phẩm không thành công",
        })
    }
}



export const read = async(req, res) => {
    try {
        const service = await Service.findOne({ _id: req.params.id }).exec();
        res.json(service);
    } catch (error) {
        res.status(400).json({
            message: "Không tìm được dịch vụ",
        })
    }
}