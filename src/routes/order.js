import { Router } from 'express';
import {
  create,
  filterByStatus,
  getByDate,
  getFutureOrderByStore,
  getOrderByDate,
  getOrderByStaffCategory,
  getOrderByUser,
  getTodayOrder,
  list,
  read,
  remove,
  searchOrder,
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

route.get('/getFutureOrderByStore/:id', getFutureOrderByStore);

route.get('/getOrderByStaffCategory', getOrderByStaffCategory);

route.get('/search-order', searchOrder);

route.get('/today-order', getTodayOrder);

route.get('/get-by-date', getByDate);

export default route;
