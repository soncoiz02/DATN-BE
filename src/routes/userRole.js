import { Router } from 'express';
import { create, list, remove } from '../controllers/userRole';

const router = Router();

router.post('/userRole', create);
router.delete('/userRole/:id', remove);
router.get('/userRole', list);

export default router;
