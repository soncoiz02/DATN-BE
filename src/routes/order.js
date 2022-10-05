import { Router } from 'express';
import {
  create,
  filterByStatus,
  getFutureOrder,
  getOrderByDate,
  getOrderByUser,
  list,
  read,
  remove,
  update,
} from '../controllers/order';

const route = Router();

route.post('/order', create);
// list
route.get('/order', list);
// remove
route.delete('/order/:id', remove);
// update
route.put('/order/:id', update);
// chi tiet
route.get('/order/:id', read);

// /api/filterByStatus?status=
route.get('/filterByStatus', filterByStatus);

route.get('/getOrderByDate', getOrderByDate);

route.get('/getOrderByUserAndDate', getOrderByUser);

route.get('/getFutureOrder', getFutureOrder);

export default route;
