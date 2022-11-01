import { Router } from 'express';
import {
  create,
  getUserVoucher,
  list,
  read,
  remove,
  update,
} from '../controllers/voucher';
import { verifyToken } from '../middlewares/token';

const router = Router();

router.post('/voucher', create);
router.get('/voucher', list);
router.get('/voucher/:id', read);
router.delete('/voucher/:id', remove);
router.put('/voucher/:id', update);
router.get('/getUserVoucher', verifyToken, getUserVoucher);

export default router;
