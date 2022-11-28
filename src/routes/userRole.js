import { Router } from 'express';
import { create, list, remove, update } from '../controllers/userRole';

const router = Router();

router.post('/userRole', create);
router.delete('/userRole/:id', remove);
router.get('/userRole', list);
router.put('/userRole', update);

export default router;
