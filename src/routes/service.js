import { Router } from 'express';
import {
  create,
  list,
  read,
  remove,
  sort,
  search,
  update,
  getServiceByStore,
  filterByCatePrice,
} from '../controllers/service';

const route = Router();

route.post('/service', create);
// list
route.get('/service', list);

// sort by rated theo avg        /api/service/sortByRated?order=0-1     0 đánh giá từ nhỏ-> lớn  1 ngược lại nhé
route.get('/service/sortByRated', sort);

// filter /api/service/filterByCatePrice?categoryId=63404d42b738b69195e43ef7&rated=4~5&price=500000~700000
route.get('/service/filterByCatePrice', filterByCatePrice);

// remove
route.delete('/service/:id', remove);
// update
route.put('/service/:id', update);
// chi tiet
route.get('/service/:slug', read);

// đường dẫn như này nhé  /api/search?q= tên
route.post('/search-service', search);

// find by storeId
route.get('/service/findByStoreId/:id', getServiceByStore);

export default route;
