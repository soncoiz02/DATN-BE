import { Router } from 'express';
import {
  adminGetUserOrder,
  create,
  filterByStatus,
  filterOrder,
  getByDate,
  getFutureOrderByStore,
  getOrderByDate,
  getOrderByService,
  getOrderByStaffCategory,
  getOrderByUser,
  getTodayOrder,
  getUserOrder,
  list,
  read,
  remove,
  searchOrder,
  update,
} from '../controllers/order';
import { verifyToken } from '../middlewares/token';

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

route.get('/getFutureOrder', getFutureOrderByStore);

route.get('/getOrderByStaffCategory', getOrderByStaffCategory);

route.get('/search-order', searchOrder);

route.get('/today-order', getTodayOrder);

route.get('/get-by-date', getByDate);

route.get('/filter-order', filterOrder);

route.get('/get-order-by-service', getOrderByService);

route.get('/get-user-order', verifyToken, getUserOrder);

route.get('/admin-get-user-order', adminGetUserOrder);

export default route;
