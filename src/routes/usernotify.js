import { Router } from 'express';
import { create, list, read, remove, update } from '../controllers/usernotify';

const router = Router();

router.post('/user-notify', create);
router.get('/user-notify', list);
router.get('/user-notify/:id', read);
router.delete('/user-notify/:id', remove);
router.put('/user-notify/:id', update);
export default router;
