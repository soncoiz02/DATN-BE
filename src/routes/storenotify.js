import { Router } from 'express';
import {
  create,
  list,
  read,
  remove,
  updateStore,
} from '../controllers/storenotify';

const router = Router();

router.post('/store-notify', create);
router.get('/store-notify', list);
router.get('/store-notify/:id', read);
router.delete('/store-notify/:id', remove);
router.put('/store-notify/:id', updateStore);
export default router;
