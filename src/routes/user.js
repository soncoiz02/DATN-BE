import { Router } from 'express';
import { removeUser } from '../controllers/user';

const router = Router();

router.delete('/removeUser/:id', removeUser);

export default router;
