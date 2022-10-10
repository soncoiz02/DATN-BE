import express from 'express';
import { createStaff, getAll } from '../controllers/staff';

const route = express.Router();

route.get('/staff', getAll);
route.post('/staff', createStaff);

export default route;
