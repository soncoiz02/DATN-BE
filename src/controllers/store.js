import Store from '../models/store';
import Category from '../models/category';
import storeRating from '../models/storeRating';
import Order from '../models/order';
import Service from '../models/service';
import Voucher from '../models/voucher';

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
    const _orders = await Order.find({})
      .populate('voucher')
      .populate('status')
      .exec();
    const orders = _orders.filter((order) => order.status.type === 'paid');
    const services = await Service.find().exec();

    let _totalRevenue = 0;
    let _totalOrders = [];
    let _totalByService = [];
    services.forEach((service) => {
      let _item = {};
      _item.serviceId = service._id;
      _item.name = service.name;
      _item.serviceRevenue = 0;
      _item.serviceOrder = 0;
      orders.forEach((order) => {
        order.servicesRegistered.forEach((item) => {
          if (item.service.toString() === service._id.toString()) {
            if (_totalOrders.indexOf(order._id) < 0) {
              _totalOrders.push(order._id);
            }
            let actual_price =
              order.voucher === null
                ? service.price
                : service.price *
                  (1 -
                    order.voucher.discount /
                      100 /
                      order.servicesRegistered.length);
            _item.serviceRevenue += actual_price;
            _item.serviceOrder += 1;
            _totalRevenue += actual_price;
          }
        });
      });
      _totalByService.push(_item);
    });
    response.json({
      revenue: _totalRevenue,
      orders: _totalOrders.length,
      services: _totalByService,
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

export const best_Services = async (request, response) => {
  try {
    const _orders = await Order.find({})
      .populate('voucher')
      .populate('status')
      .exec();
    const orders = _orders.filter((order) => order.status.type === 'paid');
    const services = await Service.find().exec();

    let _totalRevenue = 0;
    let _bestRevenueService = {};
    let _mostUsedService = {};
    let bestRevenue = 0;
    let mostUsedCount = 0;
    services.forEach((service) => {
      let _item = {};
      _item.serviceId = service._id;
      _item.name = service.name;
      _item.serviceRevenue = 0;
      _item.serviceOrder = 0;
      orders.forEach((order) => {
        order.servicesRegistered.forEach((item) => {
          if (item.service.toString() === service._id.toString()) {
            let actual_price =
              order.voucher === null
                ? service.price
                : service.price *
                  (1 -
                    order.voucher.discount /
                      100 /
                      order.servicesRegistered.length);
            _item.serviceRevenue += actual_price;
            _item.serviceOrder += 1;
            _totalRevenue += actual_price;
          }
        });
      });

      if (_item.serviceRevenue > bestRevenue) {
        bestRevenue = _item.serviceRevenue;
        _bestRevenueService.id = _item.serviceId;
        _bestRevenueService.name = _item.name;
        _bestRevenueService.revenue = bestRevenue;
      }

      if (_item.serviceOrder > mostUsedCount) {
        mostUsedCount = _item.serviceOrder;
        _mostUsedService.id = _item.serviceId;
        _mostUsedService.name = _item.name;
        _mostUsedService.used = mostUsedCount;
      }
    });

    response.json({
      storeId: request.params.id,
      revenue: _totalRevenue,
      bestRevenueService: _bestRevenueService,
      mostUsedService: _mostUsedService,
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

export const top_Services = async (request, response) => {
  try {
    const _orders = await Order.find({})
      .populate('voucher')
      .populate('status')
      .exec();
    const orders = _orders.filter((order) => order.status.type === 'paid');
    const services = await Service.find().exec();

    let _totalByService = [];
    services.forEach((service) => {
      let _item = {};
      _item.serviceId = service._id;
      _item.name = service.name;
      _item.price = service.price;
      _item.serviceRevenue = 0;
      _item.serviceOrder = 0;
      orders.forEach((order) => {
        order.servicesRegistered.forEach((item) => {
          if (item.service.toString() === service._id.toString()) {
            let actual_price =
              order.voucher === null
                ? service.price
                : service.price *
                  (1 -
                    order.voucher.discount /
                      100 /
                      order.servicesRegistered.length);
            _item.serviceRevenue += actual_price;
            _item.serviceOrder += 1;
          }
        });
      });
      _totalByService.push(_item);
    });
    const totalByService = _totalByService.sort(
      (a, b) => b.serviceRevenue - a.serviceRevenue
    );
    response.json({
      'Top 5 services': totalByService.slice(0, 5),
    });
  } catch (error) {
    console.log(error);
  }
};
