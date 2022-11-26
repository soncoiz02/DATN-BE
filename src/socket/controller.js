import Storenotify from '../models/storenotify';
import Usernotify from '../models/usernotify';

export const updateNotifyStatus = async (payload) => {
  try {
    if (payload.type === 'store') {
      const data = await Storenotify.findOneAndUpdate(
        { _id: payload.notifyId },
        { status: 1 }
      ).exec();
      return data;
    }
    if (payload.type === 'user') {
      const data = await Usernotify.findOneAndUpdate(
        { _id: payload.notifyId },
        { status: 1 }
      ).exec();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

const createStaffNotify = async (notify) => {
  try {
    const newNotify = await Usernotify(notify).save();
    return newNotify;
  } catch (error) {
    console.log(error);
  }
};

export const createNotify = async (data) => {
  try {
    const { storeNotifyData, staffNotifyData } = data;
    const newStoreNotify = await Storenotify(storeNotifyData).save();
    const newStaffNotify = await Promise.all(
      staffNotifyData.map((item) => createStaffNotify(item))
    );
    return { newStoreNotify, newStaffNotify };
  } catch (error) {
    console.log(error);
  }
};

export const createUserNotify = async (data) => {
  try {
    const newNotify = await Usernotify(data).save();
    return newNotify;
  } catch (error) {
    console.log(error);
  }
};
