import { Router } from 'express';
import {
  changePassword,
  getDetailUser,
  getListUser,
  GetoneUser,
  getStoreStaff,
  getUserRated,
  getUserRevenue,
  getVerifyCode,
  listOrdered,
  listUser,
  removeUser,
  resetPassword,
  updateMany,
  updateUser,
  verifyEmail,
} from '../controllers/user';
import { verifyToken } from '../middlewares/token';
import route from './activityLog';

const router = Router();

router.get('/user', listUser);
router.get('/user/listOrdered', listOrdered);
router.put('/user', verifyToken, updateUser);

router.get('/user/:id', GetoneUser);
router.delete('/user/:id', removeUser);
router.get('/store-staff/:id', getStoreStaff);

router.put('/change-password', verifyToken, changePassword);

router.post('/get-verify-code', getVerifyCode);

router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);

router.get('/admin-user', getListUser);

route.get('/user-revenue', getUserRevenue);

route.get('/user-rated-service', getUserRated);

export default router;
