import { Router } from 'express';
import { GetoneUser } from '../controllers/user';

const router = Router();

router.get('/user/:id', GetoneUser);

export default router;
