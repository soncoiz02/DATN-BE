import { Router } from 'express';
import {
  create,
  list,
  read,
  remove,
  searchCate,
  update,
} from '../controllers/category';

const router = Router();

router.post('/category', create);
router.get('/category', list);
router.get('/category/:id', read);
router.delete('/category/:id', remove);
router.put('/category/:id', update);

// đường dẫn như này nhé  /api/search-category?q= tên
router.post('/search-category', searchCate);

export default router;
