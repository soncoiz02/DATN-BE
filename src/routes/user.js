import { Router } from 'express';
import {
  GetoneUser,
  listUser,
  removeUser,
  updateUser,
} from '../controllers/user';

const router = Router();

router.delete('/user/:id', removeUser);
router.get('/user/:id', GetoneUser);
router.get('/user', listUser);
router.put('/user/:id', updateUser);

export default router;
