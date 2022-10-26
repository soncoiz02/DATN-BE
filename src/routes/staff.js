import express from 'express';
import {
  createStaff,
  getAll,
  getStaffByCategory,
  getStaffInTimeSlot,
  getStaffInTimeSlotAllService,
} from '../controllers/staff';

const route = express.Router();

route.get('/staff', getAll);
route.post('/staff', createStaff);
route.get('/staffByCategory/:id', getStaffByCategory);
route.get('/staffInTimeSlot/:id', getStaffInTimeSlot);
route.get('/staffInTimeSlotAllService/:id', getStaffInTimeSlotAllService);

export default route;
