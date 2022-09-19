import { Router } from 'express';
import { create, list, read, remove, update } from '../controllers/orderStatus';

const router = Router();

router.post('/order-status', create);
router.get('/order-status', list);
router.get('/order-status/:id', read);
router.delete('/order-status/:id', remove);
router.put('/order-status/:id', update);
export default router;
