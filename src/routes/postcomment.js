import { Router } from 'express';
import { create, list, read, remove, update } from '../controllers/postcomment';

const router = Router();

router.post('/post-comment', create);
router.get('/post-comment', list);
router.get('/post-comment/:id', read);
router.delete('/post-comment/:id', remove);
router.put('/post-comment/:id', update);
export default router;
