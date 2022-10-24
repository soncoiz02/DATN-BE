import Store from '../models/store';
import Category from '../models/category';
import storeRating from '../models/storeRating';
import Order from '../models/order';
import Service from '../models/service';
// eslint-disable-next-line import/prefer-default-export
export const createStore = async (request, response) => {
  try {
    const store = await new Store(request.body).save();
    response.json(store);
  } catch (error) {
    response.status(400).json({ message: error.message });
    console.log(error);
  }
};
export const listStore = async (req, res) => {
  try {
    const store = await Store.find({}).exec();
    const rated = await storeRating.find({}).exec();
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
    res.json(newStore);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const storeDetail = async (request, response) => {
  try {
    const store = await Store.findOne({ _id: request.params.id })
      .select('-storeId')
      .exec();
    const category = await Category.findOne({
      storeId: request.params.id,
    }).exec();
    const rated = await storeRating.find({ storeId: request.params.id }).exec();
    const ratedAvg =
      rated.length > 0
        ? (
            rated.reduce((prev, rateItem) => prev + rateItem.rate, 0) /
            rated.length
          ).toFixed(2)
        : 0;
    console.log(category);
    response.json({
      // eslint-disable-next-line no-underscore-dangle
      ...store._doc,
      // eslint-disable-next-line no-underscore-dangle
      category: category._doc,
      rated: {
        total: rated.length,
        avg: ratedAvg,
      },
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const deleteStore = async (request, response) => {
  try {
    const store = await Store.findOneAndDelete({
      _id: request.params.id,
    }).exec();
    response.json(store);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const updateStore = async (request, response) => {
  const option = { new: true };
  try {
    const store = await Store.findOneAndUpdate(
      { _id: request.params.id },
      request.body,
      option
    ).exec();
    response.json(store);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

export const storeRevenue = async (request, response) => {
  try {
    // console.log("storeId: " + request.params.id);
    const category = await Category.find({ storeId: request.params.id }).exec();
    // console.log("categoryId: " + category[0]._id);
    const service = await Service.find({ categoryId: category[0]._id }).exec();
    let serviceIds = [];
    for (let i = 0; i < service.length; i++) {
      serviceIds.push(service[i]['_id']);
    }
    // console.log("serviceIds: " + serviceIds);

    const _order = await Order.find({})
      .populate('status', 'type')
      .populate('serviceId', 'price');

    const order = _order.filter(
      (order) =>
        serviceIds.some((_serviceId) =>
          _serviceId.equals(order.serviceId._id)
        ) && order.status.type === 'done'
    );

    let _total = 0;
    let _shouldCount = true;
    let _totalByService = [];
    for (let i = 0; i < serviceIds.length; i++) {
      let _item = {};
      _item.serviceId = serviceIds[i];
      _item.serviceRevenue = 0;
      for (let j = 0; j < order.length; j++) {
        if (serviceIds[i].equals(order[j].serviceId._id)) {
          _item.serviceRevenue += order[j].serviceId.price;
        }

        if (_shouldCount === true) {
          _total += order[j].serviceId.price;
        }
      }
      _shouldCount = false;
      _totalByService.push(_item);
    }
    response.json({
      storeId: request.params.id,
      revenue: _total,
      services: _totalByService,
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
