import mongoose from 'mongoose';
import Store from '../models/store';
import StoreRating from '../models/storeRating';
import Category from '../models/category';

// eslint-disable-next-line import/prefer-default-export
export const searchStore = async (request, response) => {
  try {
    const conditions = { name: { $regex: request.query.key, $options: 'i' } };
    const search = await Store.find(conditions);
    response.json(search);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

export const listStoreByName = async (request, response) => {
  try {
    const store = await Store.find({}).sort([['name', 'asc']]);
    response.json(store);
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: error.message });
  }
};

export const searchByAddress = async (request, response) => {
  try {
    const search = await Store.find({
      address: { $regex: request.query.key, $options: 'si' },
    });
    response.json(search);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

export const sortByRated = async (request, response) => {
  try {
    const store = await Store.find({}).exec();
    const rated = await StoreRating.find({}).exec();
    const newStore = store.map((item) => {
      const storeRated = rated.filter((rate) =>
        // eslint-disable-next-line no-underscore-dangle
        rate.storeId.equals(item._id)
      );
      return {
        // eslint-disable-next-line no-underscore-dangle
        ...item._doc,
        rated: {
          total: storeRated.length,
          avg: (
            storeRated.reduce((prev, rateItem) => prev + rateItem.rate, 0) /
            storeRated.length
          ).toFixed(2),
        },
      };
    });
    if (request.query.order === '2') {
      response.json(newStore.sort((a, b) => b.rated.avg - a.rated.avg));
    } else {
      response.json(newStore.sort((a, b) => a.rated.avg - b.rated.avg));
    }
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

export const filterByRate = async (req, res) => {
  try {
    const store = await Store.find({}).exec();
    const rated = await StoreRating.find({}).exec();

    const newStore = store.map((item) => {
      // eslint-disable-next-line no-underscore-dangle
      const storeRated = rated.filter((rate) => rate.storeId.equals(item._id));
      return {
        // eslint-disable-next-line no-underscore-dangle
        ...item._doc,
        rated: {
          total: storeRated.length,
          avg: (
            storeRated.reduce((prev, rateItem) => prev + rateItem.rate, 0) /
            storeRated.length
          ).toFixed(2),
        },
      };
    });

    // console.log("rated: " + req.query.rated);
    if (req.query.rated.indexOf('~') > 0) {
      const _rated = req.query.rated.split('~');
      // console.log("_rated: " + _rated);
      res.json(
        newStore.filter(
          (store) =>
            parseFloat(store.rated.avg) >= parseFloat(_rated[0]) &&
            parseFloat(store.rated.avg) <= parseFloat(_rated[1])
        )
      );
    } else {
      res.json(
        newStore.filter(
          (store) => parseFloat(store.rated.avg) >= parseFloat(req.query.rated)
        )
      );
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
