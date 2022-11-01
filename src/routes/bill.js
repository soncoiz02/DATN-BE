import express from 'express';
import { create, getAll, getOne } from '../controllers/bill';

const route = express.Router();

route.get('/bill', getAll);
route.get('/bill/:id', getOne);
route.post('/bill', create);

export default route;
