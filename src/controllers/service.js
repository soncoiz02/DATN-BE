import Service from "../models/service";

// eslint-disable-next-line import/prefer-default-export
export const creat = (req, res) => {
    try {
        const service = new Service(req.body).save();
        res.json(service);
    } catch (error) {
        res.status(400).json({
            message: "Thêm dịch vụ không thành công"
        })
    }
}