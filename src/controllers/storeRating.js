import StoreRating from '../models/storeRating';

// eslint-disable-next-line import/prefer-default-export
export const createStoreRating = async (req, res) => {
  try {
    const storeRating = await new StoreRating(req.body).save();
    console.log(storeRating);
    res.json(storeRating);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const listStoreRating = async (req, res) => {
  try {
    const storeRating = await StoreRating.find({})
      .populate('userId', 'email username')
      .populate('storeId', 'name address avt hotline');
    res.json(storeRating);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const removeStoreRating = async (req, res) => {
  const option = { new: true };
  try {
    const storeRating = await StoreRating.findOneAndDelete({
      _id: req.params.id,
      option,
    }).exec();
    res.json(storeRating);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateStoreRating = async (req, res) => {
  const option = {
    new: true,
  };
  try {
    const storeRating = await StoreRating.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      option
    ).exec();
    res.json(storeRating);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

export const readStoreRating = async (req, res) => {
  try {
    const storeRating = await StoreRating.findOne({
      _id: req.params.id,
    })
      .populate('userId', 'email username')
      .populate('storeId', 'name address avt hotline');
    res.json(storeRating);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getStoreRated = async (request, response) => {
  try {
    const { storeId } = request.query;
    const data = await StoreRating.find({ storeId }).exec();
    const avg = (
      data.reduce((prev, item) => prev + item.rate, 0) / data.length
    ).toFixed(1);
    response.json({
      total: data.length,
      list: data,
      avg,
    });
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
