import { Router } from 'express';
import {
  filterByRate,
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
  stRevenue,
  updateStore,
} from '../controllers/store';

const router = Router();

router.post('/store', createStore);
router.get('/store', listStore);
router.get('/searchName', searchStore);
router.get('/searchAddress', searchByAddress);
router.get('/store/storeName', listStoreByName);
router.get('/sortByRated', sortByRated);
router.get('/filterByRated', filterByRate);
router.get('/store/:id', storeDetail);
router.delete('/store/:id', deleteStore);
router.put('/store/:id', updateStore);
router.get('/store-revenue/:id', stRevenue);
export default router;
