import Service from '../models/service';

// eslint-disable-next-line import/prefer-default-export
export const create = (req, res) => {
  try {
    const service = new Service(req.body).save();
    return res.json(service);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const list = async (req, res) => {
  try {
    const service = await Service.find({}).populate('ServiceStep_id');
    return res.json(service);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
    }).exec();
    return res.json(service);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    ).exec();
    return res.json(service);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const read = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id }).exec();
    return res.json(service);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
