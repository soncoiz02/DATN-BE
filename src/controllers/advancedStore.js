import Store from '../models/store';

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
export const filterByRate = async (request, response) => {
  try {
    const store = await Store.find({
      rateId: request.query.rateId.split(','),
    }).populate('rateId', 'rate content');
    console.log(store);
    response.json(store);
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: error.message });
  }
};
