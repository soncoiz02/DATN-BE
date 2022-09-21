import Order from '../models/order';

// eslint-disable-next-line import/prefer-default-export
export const create = async (req, res) => {
  try {
    const order = await new Order(req.body).save();
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
    res.json(order);
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
