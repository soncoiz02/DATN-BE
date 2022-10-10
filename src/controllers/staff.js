import Staff from '../models/staff';

export const createStaff = async (req, res) => {
  try {
    const staff = await new Staff(req.body).save();
    res.json(staff);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const staffs = await Staff.find({}).exec();
    res.json(staffs);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
