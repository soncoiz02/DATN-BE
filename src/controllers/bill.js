import Bill from '../models/bill';

export const create = async (req, res) => {
  try {
    const bill = await new Bill(req.body).save();
    res.json(bill);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const list = async (req, res) => {
  try {
    const bill = await Bill.find({}).exec();
    res.json(bill);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const read = async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id }).exec();
    res.json(bill);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const bill = await Bill.findOneAndDelete({ _id: req.params.id }).exec();
    res.json(bill);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const update = async (req, res) => {
  const condition = { _id: req.params.id };
  const update = req.body;
  try {
    const product = await Bill.findOneAndUpdate(condition, update).exec();
    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
