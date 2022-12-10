import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import mongoose from 'mongoose';
import Order from '../models/order';
import Service from '../models/service';
import User from '../models/user';

// eslint-disable-next-line import/prefer-default-export
export const getBestStatistic = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'services',
          foreignField: '_id',
          localField: 'servicesRegistered.service',
          as: 'service',
        },
      },
      {
        $lookup: {
          from: 'vouchers',
          foreignField: '_id',
          localField: 'voucher',
          as: 'voucher',
        },
      },
      {
        $match: {
          status: new mongoose.Types.ObjectId('634e59b757b7ea792917962c'),
        },
      },
      {
        $addFields: {
          sumPrice: {
            $sum: '$service.price',
          },
        },
      },
      {
        $project: {
          service: 0,
          servicesRegistered: 0,
        },
      },
    ]);

    let totalRevenue = 0;

    orders.forEach((item) => {
      if (item.voucher.length > 0) {
        const total =
          item.sumPrice + (item.sumPrice * item.voucher[0].discount) / 100;
        totalRevenue += total;
      } else {
        totalRevenue += item.sumPrice;
      }
    });

    const services = await Service.aggregate([
      {
        $lookup: {
          from: 'orders',
          foreignField: 'servicesRegistered.service',
          localField: '_id',
          as: 'orders',
          pipeline: [
            {
              $match: {
                status: new mongoose.Types.ObjectId('634e59b757b7ea792917962c'),
              },
            },
            {
              $lookup: {
                from: 'vouchers',
                foreignField: '_id',
                localField: 'voucher',
                as: 'voucher',
              },
            },
          ],
        },
      },
    ]);

    const serviceFiltered = [];

    services.forEach((service) => {
      let totalPrice = 0;
      service.orders.forEach((order) => {
        if (order.voucher.length > 0) {
          const discount =
            order.voucher[0].discount / order.servicesRegistered.length;
          const servicePrice = service.price - (service.price * discount) / 100;
          totalPrice += servicePrice;
        } else {
          totalPrice += service.price;
        }
      });

      serviceFiltered.push({
        total: totalPrice,
        countUsed: service.orders.length,
        service,
      });
    });

    const maxPriceService = serviceFiltered.sort(
      (a, b) => b.total - a.total
    )[0];
    const maxUsedService = serviceFiltered.sort(
      (a, b) => b.countUsed - a.countUsed
    )[0];

    res.json({ totalRevenue, maxPriceService, maxUsedService });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getStatisticByDate = async (req, res) => {
  try {
    const { dateStart, dateEnd, category } = req.query;
    const listDate = [];
    const curr = startOfDay(new Date(dateStart));
    while (curr <= startOfDay(new Date(dateEnd))) {
      listDate.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    const handleGetServicesPerDay = async (day) => {
      const services = await Service.aggregate([
        {
          $match: {
            categoryId: new mongoose.Types.ObjectId(category),
          },
        },
        {
          $lookup: {
            from: 'orders',
            foreignField: 'servicesRegistered.service',
            localField: '_id',
            as: 'orders',
            pipeline: [
              {
                $match: {
                  status: new mongoose.Types.ObjectId(
                    '634e59b757b7ea792917962c'
                  ),
                  startDate: {
                    $gte: startOfDay(day),
                    $lte: endOfDay(day),
                  },
                },
              },
              {
                $lookup: {
                  from: 'vouchers',
                  foreignField: '_id',
                  localField: 'voucher',
                  as: 'voucher',
                },
              },
            ],
          },
        },
      ]);

      const serviceFiltered = [];

      services.forEach((service) => {
        let totalPrice = 0;
        service.orders.forEach((order) => {
          if (order.voucher.length > 0) {
            const discount =
              order.voucher[0].discount / order.servicesRegistered.length;
            const servicePrice =
              service.price - (service.price * discount) / 100;
            totalPrice += servicePrice;
          } else {
            totalPrice += service.price;
          }
        });

        serviceFiltered.push({
          total: totalPrice,
          countUsed: service.orders.length,
          service,
        });
      });

      return {
        date: day,
        listServices: serviceFiltered,
      };
    };

    const listServicePerDay = await Promise.all(
      listDate.map((day) => handleGetServicesPerDay(day))
    );

    res.json(listServicePerDay);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getStatisticPerMonth = async (req, res) => {
  try {
    const { year, category } = req.query;
    const listMonth = [];
    for (let i = 0; i < 12; i++) {
      const startMonth = startOfMonth(new Date(year, i, 1, 0, 0, 0));
      const endMonth = endOfMonth(new Date(year, i, 1, 0, 0, 0));
      listMonth.push({
        start: startMonth,
        end: endMonth,
      });
    }

    const monthName = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];

    const handleGetServicesPerMonth = async (month, index) => {
      const services = await Service.aggregate([
        {
          $match: {
            categoryId: new mongoose.Types.ObjectId(category),
          },
        },
        {
          $lookup: {
            from: 'orders',
            foreignField: 'servicesRegistered.service',
            localField: '_id',
            as: 'orders',
            pipeline: [
              {
                $match: {
                  status: new mongoose.Types.ObjectId(
                    '634e59b757b7ea792917962c'
                  ),
                  startDate: {
                    $gte: startOfDay(month.start),
                    $lte: endOfDay(month.end),
                  },
                },
              },
              {
                $lookup: {
                  from: 'vouchers',
                  foreignField: '_id',
                  localField: 'voucher',
                  as: 'voucher',
                },
              },
            ],
          },
        },
      ]);

      const serviceFiltered = [];

      services.forEach((service) => {
        let totalPrice = 0;
        service.orders.forEach((order) => {
          if (order.voucher.length > 0) {
            const discount =
              order.voucher[0].discount / order.servicesRegistered.length;
            const servicePrice =
              service.price - (service.price * discount) / 100;
            totalPrice += servicePrice;
          } else {
            totalPrice += service.price;
          }
        });

        serviceFiltered.push({
          total: totalPrice,
          countUsed: service.orders.length,
          service,
        });
      });

      return {
        date: monthName[index],
        listServices: serviceFiltered,
      };
    };

    const listServicePerMonth = await Promise.all(
      listMonth.map((month, index) => handleGetServicesPerMonth(month, index))
    );
    res.json(listServicePerMonth);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getServiceRevenue = async (req, res) => {
  try {
    const services = await Service.aggregate([
      {
        $lookup: {
          from: 'orders',
          foreignField: 'servicesRegistered.service',
          localField: '_id',
          as: 'orders',
          pipeline: [
            {
              $match: {
                status: new mongoose.Types.ObjectId('634e59b757b7ea792917962c'),
              },
            },
            {
              $lookup: {
                from: 'vouchers',
                foreignField: '_id',
                localField: 'voucher',
                as: 'voucher',
              },
            },
          ],
        },
      },
    ]);

    const serviceFiltered = [];

    services.forEach((service) => {
      let totalPrice = 0;
      service.orders.forEach((order) => {
        if (order.voucher.length > 0) {
          const discount =
            order.voucher[0].discount / order.servicesRegistered.length;
          const servicePrice = service.price - (service.price * discount) / 100;
          totalPrice += servicePrice;
        } else {
          totalPrice += service.price;
        }
      });

      serviceFiltered.push({
        total: totalPrice,
        countUsed: service.orders.length,
        service,
      });
    });

    res.json(serviceFiltered);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getRevenueByDate = async (req, res) => {
  try {
    const { dateStart, dateEnd } = req.query;

    const listDate = [];
    const curr = startOfDay(new Date(dateStart));
    while (curr <= startOfDay(new Date(dateEnd))) {
      listDate.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    const handleGetRevenueByDate = async (date) => {
      const orders = await Order.aggregate([
        {
          $match: {
            status: new mongoose.Types.ObjectId('634e59b757b7ea792917962c'),
            startDate: {
              $gte: startOfDay(date),
              $lte: endOfDay(date),
            },
          },
        },
        {
          $lookup: {
            from: 'services',
            foreignField: '_id',
            localField: 'servicesRegistered.service',
            as: 'service',
          },
        },
        {
          $lookup: {
            from: 'vouchers',
            foreignField: '_id',
            localField: 'voucher',
            as: 'voucher',
          },
        },
        {
          $addFields: {
            sumPrice: {
              $sum: '$service.price',
            },
          },
        },
        {
          $project: {
            service: 0,
            servicesRegistered: 0,
          },
        },
      ]);

      let totalRevenue = 0;

      orders.forEach((item) => {
        if (item.voucher.length > 0) {
          const total =
            item.sumPrice + (item.sumPrice * item.voucher[0].discount) / 100;
          totalRevenue += total;
        } else {
          totalRevenue += item.sumPrice;
        }
      });

      return {
        date,
        totalRevenue,
      };
    };

    const listRevenueByDate = await Promise.all(
      listDate.map((item) => handleGetRevenueByDate(item))
    );

    res.json(listRevenueByDate);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getRevenueByMonth = async (req, res) => {
  try {
    const { year } = req.query;

    const listMonth = [];
    for (let i = 0; i < 12; i++) {
      const startMonth = startOfMonth(new Date(year, i, 1, 0, 0, 0));
      const endMonth = endOfMonth(new Date(year, i, 1, 0, 0, 0));
      listMonth.push({
        start: startMonth,
        end: endMonth,
      });
    }

    const monthName = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];

    const handleGetRevenueByMonth = async (month, index) => {
      const orders = await Order.aggregate([
        {
          $match: {
            status: new mongoose.Types.ObjectId('634e59b757b7ea792917962c'),
            startDate: {
              $gte: startOfDay(month.start),
              $lte: endOfDay(month.end),
            },
          },
        },
        {
          $lookup: {
            from: 'services',
            foreignField: '_id',
            localField: 'servicesRegistered.service',
            as: 'service',
          },
        },
        {
          $lookup: {
            from: 'vouchers',
            foreignField: '_id',
            localField: 'voucher',
            as: 'voucher',
          },
        },
        {
          $addFields: {
            sumPrice: {
              $sum: '$service.price',
            },
          },
        },
        {
          $project: {
            service: 0,
            servicesRegistered: 0,
          },
        },
      ]);

      let totalRevenue = 0;

      orders.forEach((item) => {
        if (item.voucher.length > 0) {
          const total =
            item.sumPrice + (item.sumPrice * item.voucher[0].discount) / 100;
          totalRevenue += total;
        } else {
          totalRevenue += item.sumPrice;
        }
      });

      return {
        date: monthName[index],
        totalRevenue,
      };
    };

    const listRevenueByMonth = await Promise.all(
      listMonth.map((item, index) => handleGetRevenueByMonth(item, index))
    );

    res.json(listRevenueByMonth);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getDashboardStatistic = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          roleId: new mongoose.Types.ObjectId('636d182beac3f0af67254737'),
        },
      },
      {
        $lookup: {
          from: 'orders',
          foreignField: 'userId',
          localField: '_id',
          as: 'orders',
        },
      },
      {
        $project: {
          item: 1,
          username: 1,
          totalOrders: {
            $size: '$orders',
          },
        },
      },
      {
        $match: {
          totalOrders: {
            $gt: 0,
          },
        },
      },
    ]).count('username');

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'services',
          foreignField: '_id',
          localField: 'servicesRegistered.service',
          as: 'service',
        },
      },
      {
        $lookup: {
          from: 'vouchers',
          foreignField: '_id',
          localField: 'voucher',
          as: 'voucher',
        },
      },
      {
        $match: {
          status: new mongoose.Types.ObjectId('634e59b757b7ea792917962c'),
        },
      },
      {
        $addFields: {
          sumPrice: {
            $sum: '$service.price',
          },
        },
      },
      {
        $project: {
          service: 0,
          servicesRegistered: 0,
        },
      },
    ]);

    let totalRevenue = 0;

    orders.forEach((item) => {
      if (item.voucher.length > 0) {
        const total =
          item.sumPrice + (item.sumPrice * item.voucher[0].discount) / 100;
        totalRevenue += total;
      } else {
        totalRevenue += item.sumPrice;
      }
    });

    const totalOrder = await Order.count().exec();

    res.json({
      totalUser: users.length > 0 ? users[0].username : 0,
      totalOrder,
      totalRevenue,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
