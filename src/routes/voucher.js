import { Router } from 'express';
import { create, list, read, remove, update } from '../controllers/voucher';

const router = Router();

router.post('/voucher', create);
router.get('/voucher', list);
router.get('/voucher/:id', read);
router.delete('/voucher/:id', remove);
router.put('/voucher/:id', update);

export default router;
