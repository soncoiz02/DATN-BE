import express from 'express';
import { create, getAll, getOne } from '../controllers/activityLog';

const route = express.Router();

route.get('/activityLog', getAll);
route.get('/activityLog/:id', getOne);
route.post('/activityLog', create);

export default route;
