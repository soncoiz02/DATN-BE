/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
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

export const search = async (req, res) => {
  const searchString = req.query.q ? req.query.q : '';

  const result = await Service.find({
    $text: { $search: searchString },
  }).exec();
  res.json(result);
};

export const sort = async (req, res) => {
  try {
    const service = await Service.find({}).exec();
    let rated = await ServiceRating.find({}).exec();
    const steps = await ServiceStep.find({}).exec();
    const newService = service.map((item) => {
      const serviceRated = rated.filter((rate) =>
        rate.serviceId.equals(item._id)
      );
      const serviceStep = steps.filter((step) =>
        step.serviceId.equals(item._id)
      );
      return {
        // eslint-disable-next-line no-underscore-dangle
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
    if (req.query.order === '1') {
      // rated: avg from high to low
      res.json(newService.sort((a, b) => b.rated.avg - a.rated.avg));
    } else {
      // rated: avg from low to high
      res.json(newService.sort((a, b) => a.rated.avg - b.rated.avg));
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getServiceByStore = async (req, res) => {
  try {
    const services = await Service.aggregate([
      {
        $lookup: {
          from: 'categories',
          foreignField: '_id',
          localField: 'categoryId',
          as: 'categories',
        },
      },
      {
        $lookup: {
          from: 'stores',
          foreignField: '_id',
          localField: 'categories.storeId',
          as: 'stores',
        },
      },
      {
        $lookup: {
          from: 'servicesteps',
          foreignField: 'serviceId',
          localField: '_id',
          as: 'steps',
        },
      },
      {
        $lookup: {
          from: 'serviceratings',
          foreignField: 'serviceId',
          localField: '_id',
          as: 'rated',
        },
      },
      {
        $match: {
          'stores._id': new mongoose.Types.ObjectId(req.params.id),
        },
      },
    ]);
    res.json(services);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const filter = async (req, res) => {
  try {
    if (req.query.categoryId === undefined) {
      return res.json({ msg: 'categoryId is required' });
    }

    if (req.query.rated === undefined && req.query.price === undefined) {
      return res.json({ msg: 'rated or price is required' });
    }
    // console.log(req.query.categoryId);

    let service = await Service.find({
      categoryId: req.query.categoryId,
    }).exec();
    if (req.query.price !== undefined) {
      // console.log("price: " + req.query.price);
      service = await Service.find({
        categoryId: req.query.categoryId,
        price: { $gte: parseInt(req.query.price) },
      }).exec();
    }
    let rated = await ServiceRating.find({}).exec();
    const steps = await ServiceStep.find({}).exec();
    let newService = service.map((item) => {
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
    if (req.query.rated !== undefined) {
      // console.log("rated: " + parseFloat(req.query.rated));
      newService = newService.filter(
        (service) =>
          parseFloat(service.rated.avg) >= parseFloat(req.query.rated)
      );
    }
    res.json(newService);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
