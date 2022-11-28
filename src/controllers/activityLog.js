import ActivityLog from '../models/activityLog';

export const create = async (req, res) => {
  try {
    const activity = await new ActivityLog(req.body).save();
    res.json(activity);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const activities = await ActivityLog.find().exec();
    res.json(activities);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const activities = await ActivityLog.findOne({ _id: req.params.id }).exec();
    res.json(activities);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
