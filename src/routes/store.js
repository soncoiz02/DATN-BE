import { Router } from 'express';
import {
  listStoreByName,
  searchStore,
  sortByRated,
} from '../controllers/advancedStore';

import {
  createStore,
  deleteStore,
  listStore,
  storeDetail,
  updateStore,
} from '../controllers/store';

const router = Router();

router.post('/store', createStore);
router.get('/store', listStore);
router.get('/store/:id', storeDetail);
router.delete('/store/:id', deleteStore);
router.put('/store/:id', updateStore);
router.get('/search', searchStore);
router.get('/storeName', listStoreByName);
router.get('/sortByRated', sortByRated);

export default router;
