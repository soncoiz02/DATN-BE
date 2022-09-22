import Service from '../models/service';
import ServiceStep from '../models/serviceStep';
import ServiceRating from '../models/serviceRating';

// eslint-disable-next-line import/prefer-default-export
export const create = async (req, res) => {
  try {
    const service = await new Service(req.body).save();
    res.json(service);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const list = async (req, res) => {
  try {
    const service = await Service.find({}).exec();
    const rated = await ServiceRating.find({}).exec();
    const steps = await ServiceStep.find({}).exec();
    const newService = service.map((item) => {
      const serviceRated = rated.filter((rate) =>
        rate.serviceId.equals(item._id)
      );
      const serviceStep = steps.filter((step) =>
        step.serviceId.equals(item._id)
      );
      return {
        ...item._doc,
        steps: serviceStep,
        rated: {
          total: serviceRated.length,
          avg: (
            serviceRated.reduce((prev, rateItem) => prev + rateItem.rate, 0) /
            serviceRated.length
          ).toFixed(2),
        },
      };
    });
    res.json(newService);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
    }).exec();
    res.json(service);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    res.json(service);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const read = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id }).exec();
    const rated = await ServiceRating.find({ serviceId: req.params.id }).exec();
    const steps = await ServiceStep.find({ serviceId: req.params.id }).exec();
    const ratedAvg =
      rated.length > 0
        ? (
            rated.reduce((prev, rateItem) => prev + rateItem.rate, 0) /
            rated.length
          ).toFixed(2)
        : 0;
    res.json({
      ...service._doc,
      steps,
      rated: {
        total: rated.length,
        avg: ratedAvg,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
