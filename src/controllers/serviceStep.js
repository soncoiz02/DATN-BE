import ServiceStep from '../models/serviceStep';

// eslint-disable-next-line import/prefer-default-export
export const create = async (req, res) => {
  try {
    const serviceStep = await new ServiceStep(req.body).save();
    return res.json(serviceStep);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const list = async (req, res) => {
  try {
    const serviceStep = await ServiceStep.find({}).exec();
    return res.json(serviceStep);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const serviceStep = await ServiceStep.findOneAndDelete({
      _id: req.params.id,
    }).exec();
    return res.json(serviceStep);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const serviceStep = await ServiceStep.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    ).exec();
    return res.json(serviceStep);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const read = async (req, res) => {
  try {
    const serviceStep = await ServiceStep.findOne({
      _id: req.params.id,
    }).exec();
    return res.json(serviceStep);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
