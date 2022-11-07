import { Router } from 'express';
import {
  create,
  list,
  read,
  remove,
  staffNotify,
  update,
} from '../controllers/usernotify';
import { verifyToken } from '../middlewares/token';

const router = Router();

router.post('/user-notify', create);
router.get('/user-notify', list);
router.get('/user-notify/:id', read);
router.delete('/user-notify/:id', remove);
router.put('/user-notify/:id', update);
router.get('/staff-notify', verifyToken, staffNotify);
export default router;
