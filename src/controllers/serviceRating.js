import slugify from 'slugify'
import ServiceRating from "../models/serviceRating";


// eslint-disable-next-line import/prefer-default-export
export const createServeRating = async (req, res) => {
    try {
        const serviceRating = await new ServiceRating(req.body).save();
        console.log(serviceRating)
        res.json(serviceRating);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const listServeRating = async (req, res) => {
    try {
        const serviceRating = await ServiceRating.find({}).exec();
        res.json(serviceRating);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const removeServeRating = async (req, res) => {
    try {
        const serviceRating = await ServiceRating.findOneAndDelete({ _id: req.params.id }).exec();
        res.json(serviceRating);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const updateServeRating = async (req, res) => {
    const option = {
        new: true,
    }
    try {
        const serviceRating = await ServiceRating.findOneAndUpdate({ _id: req.params.id }, req.body, option).exec();
        res.json(serviceRating);
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}

export const readServeRating = async (req, res) => {
    try {
        const serviceRating = await ServiceRating.findOne({ _id: req.params.id }).exec();
        res.json(serviceRating);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}