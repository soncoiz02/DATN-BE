import Order from '../models/order';

// eslint-disable-next-line import/prefer-default-export
export const create = async (req, res) => {
  try {
    const order = await new Order(req.body).save();
    // eslint-disable-next-line no-underscore-dangle
    const detailOrder = await Order.findById(order._id)
      .populate('status')
      .populate('serviceId', 'name desc price image duration status')
      .exec();
    res.json(detailOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const list = async (req, res) => {
  try {
    const order = await Order.find({})
      .populate('status')
      .populate('serviceId', 'name desc price image duration status');
    let total_count = 0;
    let pending_count = 0;
    let reject_count = 0;
    let accepted_count = 0;
    let done_count = 0;
    for (let i = 0; i < order.length; i++) {
      if (order[i].status.type === 'pending') {
        pending_count += 1;
      } else if (order[i].status.type === 'reject') {
        reject_count += 1;
      } else if (order[i].status.type === 'accepted') {
        accepted_count += 1;
      } else if (order[i].status.type === 'done') {
        done_count += 1;
      }
      total_count += 1;
    }
    res.json({
      summary: {
        total: total_count,
        pending: pending_count,
        reject: reject_count,
        accepted: accepted_count,
        done: done_count,
      },
      orders: order,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id }).exec();
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    ).exec();
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const read = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id })
      .populate('status')
      .populate('serviceId', 'name desc price image duration status')
      .exec();
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const filterByStatus = async (req, res) => {
  // let filter = {}
  // if (req.query.status) {
  //     // eslint-disable-next-line no-unused-vars
  //     filter = { status: req.query.status.split(',') }
  // }

  try {
    const order = await Order.find({ status: req.query.status.split(',') })
      .populate('status')
      .populate('serviceId', 'name desc price image duration status');
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
