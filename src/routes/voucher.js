import { Router } from 'express';
import {
  create,
  list,
  read,
  remove,
  update,
  search,
} from '../controllers/voucher';

const router = Router();

router.post('/voucher', create);
router.get('/voucher', list);
router.get('/voucher/:id', read);
router.delete('/voucher/:id', remove);
router.put('/voucher/:id', update);
router.post('/search-voucher', search);

export default router;
