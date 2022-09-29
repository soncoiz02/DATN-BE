import { Router } from 'express';
import {
  create,
  list,
  read,
  remove,
  sort,
  update,
} from '../controllers/service';

const route = Router();

route.post('/service', create);
// list
route.get('/service', list);

// sort by rated theo avg        /api/service/sortByRated?order=0-1     0 đánh giá từ nhỏ-> lớn  1 ngược lại nhé
route.get('/service/sortByRated', sort);

// remove
route.delete('/service/:id', remove);
// update
route.put('/service/:id', update);
// chi tiet
route.get('/service/:id', read);

export default route;
