import { Router } from 'express';
import {
  create,
  findByStoreId,
  list,
  read,
  remove,
  sort,
  search,
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

// đường dẫn như này nhé  /api/search?q= tên
route.post('/search-service', search);

// find by storeId
route.get('/service/findByStoreId/:id', findByStoreId);

export default route;
