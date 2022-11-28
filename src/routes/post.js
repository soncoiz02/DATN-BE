import { Router } from 'express';
import { create, list, read, remove, update } from '../controllers/post';

const router = Router();

router.post('/post', create);
router.get('/post', list);
router.get('/post/:id', read);
router.delete('/post/:id', remove);
router.put('/post/:id', update);
export default router;
