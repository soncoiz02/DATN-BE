import { Router } from 'express';
import {
  createStoreRating,
  listStoreRating,
  readStoreRating,
  removeStoreRating,
  updateStoreRating,
} from '../controllers/storeRating';

const route = Router();

route.post('/store-rating', createStoreRating);
route.get('/store-rating', listStoreRating);
route.get('/store-rating/:id', readStoreRating);
route.delete('/store-rating/:id', removeStoreRating);
route.put('/store-rating/:id', updateStoreRating);

export default route;
