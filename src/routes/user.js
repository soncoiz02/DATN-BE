import { Router } from 'express';
import {
  changePassword,
  GetoneUser,
  getStoreStaff,
  getVerifyCode,
  listOrdered,
  listUser,
  removeUser,
  resetPassword,
  updateUser,
  verifyEmail,
} from '../controllers/user';
import { verifyToken } from '../middlewares/token';

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

export default router;
