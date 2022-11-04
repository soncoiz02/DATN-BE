import Storenotify from '../models/storenotify';

export const updateNotifyStatus = async (id) => {
  try {
    const data = await Storenotify.findOneAndUpdate(
      { _id: id },
      { status: 1 }
    ).exec();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createNotify = async (data) => {
  try {
    const newNotify = await Storenotify(data).save();
    return newNotify;
  } catch (error) {
    console.log(error);
  }
};
