import { Router } from 'express';
import {
  create,
  list,
  read,
  remove,
  search,
  update,
} from '../controllers/service';

const route = Router();

route.post('/service', create);
// list
route.get('/service', list);
// remove
route.delete('/service/:id', remove);
// update
route.put('/service/:id', update);
// chi tiet
route.get('/service/:id', read);

// đường dẫn như này nhé  /api/search?q= tên
route.post('/search-service', search);

export default route;
