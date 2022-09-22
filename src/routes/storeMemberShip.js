import { Router } from 'express';
import {
  createStoreMemberShip,
  listStoreMemberShip,
  readStoreMemberShip,
  removeStoreMemberShip,
  updateStoreMemberShip,
} from '../controllers/storeMemberShip';

const route = Router();

route.post('/store-member-ship', createStoreMemberShip);
route.get('/store-member-ship', listStoreMemberShip);
route.get('/store-member-ship/:id', readStoreMemberShip);
route.delete('/store-member-ship/:id', removeStoreMemberShip);
route.put('/store-member-ship/:id', updateStoreMemberShip);

export default route;
