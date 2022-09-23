import { Router } from 'express';
import {
  create,
  filterUserByService,
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

// /api/filterUserByService?status=
route.get('/filterUserByService', filterUserByService);
export default route;
