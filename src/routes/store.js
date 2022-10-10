import { Router } from 'express';
import {
  listStoreByName,
  searchByAddress,
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
router.get('/searchName', searchStore);
router.get('/searchAddress', searchByAddress);
router.get('/store/storeName', listStoreByName);
router.get('/store/sortByRated', sortByRated);

export default router;
