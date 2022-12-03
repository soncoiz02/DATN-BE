/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import Service from '../models/service';
import ServiceStep from '../models/serviceStep';
import ServiceRating from '../models/serviceRating';
import slugify from 'slugify';

// eslint-disable-next-line import/prefer-default-export
export const create = async (req, res) => {
  req.body.slug = slugify(req.body.name);
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
    const services = await Service.aggregate([
      {
        $lookup: {
          from: 'serviceratings',
          foreignField: 'serviceId',
          localField: '_id',
          as: 'rated',
        },
      },
      {
        $lookup: {
          from: 'categories',
          foreignField: '_id',
          localField: 'categoryId',
          as: 'category',
        },
      },
    ]);

    const serviceFormated = services.map((service) => {
      const totalRated = service.rated.length;
      const avgRated =
        service.rated.reduce((a, b) => a + b.rate, 0) / totalRated;

      return {
        ...service,
        rated: {
          total: totalRated,
          avg: avgRated ? +avgRated.toFixed(1) : 0,
        },
      };
    });

    res.json(serviceFormated);
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
  const options = { new: true };
  req.body.slug = slugify(req.body.name);

  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      options
    ).exec();
    res.json(service);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const read = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug })
      .populate('categoryId')
      .exec();
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
      ...service,
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
          as: 'rate',
        },
      },
      {
        $match: {
          'categories._id': {
            $ne: new mongoose.Types.ObjectId('63518497a3ca43d2916000cc'),
          },
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

export const filterByCatePrice = async (req, res) => {
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
      if (req.query.price.indexOf('~') > 0) {
        const _price = req.query.price.split('~');
        // console.log("_price: " + _price);
        service = await Service.find({
          categoryId: req.query.categoryId,
          price: {
            $gte: parseInt(_price[0]),
            $lte: parseInt(_price[1]),
          },
        }).exec();
      } else {
        service = await Service.find({
          categoryId: req.query.categoryId,
          price: { $gte: parseInt(req.query.price) },
        }).exec();
      }
    }
    const rated = await ServiceRating.find({}).exec();
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
      // console.log("rated: " + req.query.rated);
      if (req.query.rated.indexOf('~') > 0) {
        const _rated = req.query.rated.split('~');
        // console.log("_rated: " + _rated);
        newService = newService.filter(
          (service) =>
            parseFloat(service.rated.avg) >= parseFloat(_rated[0]) &&
            parseFloat(service.rated.avg) <= parseFloat(_rated[1])
        );
      } else {
        newService = newService.filter(
          (service) =>
            parseFloat(service.rated.avg) >= parseFloat(req.query.rated)
        );
      }
    }
    res.json(newService);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getServiceByCate = async (req, res) => {
  try {
    const { cateId } = req.query;
    const services = await Service.aggregate([
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(cateId),
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
    ]);

    const serviceFormated = services.map((service) => {
      const totalRated = service.rated.length;
      const avgRated =
        service.rated.reduce((a, b) => a + b.rate, 0) / totalRated;

      return {
        ...service,
        rated: {
          total: totalRated,
          avg: avgRated ? +avgRated.toFixed(1) : 0,
        },
      };
    });

    res.json(serviceFormated);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getServicePerPage = async (req, res) => {
  try {
    const { page } = req.query;
    const size = 10;
    const pageSkip = (page - 1) * size;
    const services = await Service.find({})
      .populate('categoryId')
      .skip(pageSkip)
      .limit(size)
      .exec();

    const total = await Service.count().exec();
    res.json({
      data: services,
      total,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
