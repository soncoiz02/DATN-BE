import { Router } from 'express';
import {
  create,
  filterByStatus,
  getTodayOrder,
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

route.get('/getTodayOrder', getTodayOrder);

export default route;
