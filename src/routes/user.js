import { Router } from 'express';
import {
  GetoneUser,
  getStoreStaff,
  listUser,
  removeUser,
  updateUser,
} from '../controllers/user';

const router = Router();

router.get('/user/:id', GetoneUser);
router.get('/user', listUser);
router.put('/user/:id', updateUser);

router.delete('/user/:id', removeUser);
router.get('/store-staff/:id', getStoreStaff);

export default router;
