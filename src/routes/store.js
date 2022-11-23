import { Router } from 'express';
import {
  filterByRate,
  listStoreByName,
  searchByAddress,
  searchStore,
  sortByRated,
} from '../controllers/advancedStore';

import {
  best_Services,
  createStore,
  deleteStore,
  listStore,
  storeDetail,
  storeRevenue,
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
router.get('/store-revenue', storeRevenue);
router.get('/store/bestServices', best_Services);
router.get('/store/:id', storeDetail);
router.delete('/store/:id', deleteStore);
router.put('/store/:id', updateStore);

export default router;
