import StoreMemberShip from '../models/storeMemberShip';

// eslint-disable-next-line import/prefer-default-export
export const createStoreMemberShip = async (req, res) => {
  try {
    const storeMemberShip = await new StoreMemberShip(req.body).save();
    res.json(storeMemberShip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const listStoreMemberShip = async (req, res) => {
  try {
    const storeMemberShip = await StoreMemberShip.find({}).exec();
    res.json(storeMemberShip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const removeStoreMemberShip = async (req, res) => {
  try {
    const storeMemberShip = await StoreMemberShip.findOneAndDelete({
      _id: req.params.id,
    }).exec();
    res.json(storeMemberShip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateStoreMemberShip = async (req, res) => {
  const option = {
    new: true,
  };
  try {
    const storeMemberShip = await StoreMemberShip.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      option
    ).exec();
    res.json(storeMemberShip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const readStoreMemberShip = async (req, res) => {
  try {
    const storeMemberShip = await StoreMemberShip.findOne({
      _id: req.params.id,
    }).exec();
    res.json(storeMemberShip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
