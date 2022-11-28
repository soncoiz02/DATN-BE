import { Router } from 'express';
import {
  createServeRating,
  getAllServiceRated,
  getBestRatedServices,
  getServiceOrderByUser,
  getUserRated,
  listServeRating,
  readServeRating,
  removeServeRating,
  updateServeRating,
} from '../controllers/serviceRating';
import { verifyToken } from '../middlewares/token';

const route = Router();

route.post('/service-rating', createServeRating);
route.get('/service-rating', listServeRating);
route.get('/service-rated', getAllServiceRated);
route.get('/service-rating-best', getBestRatedServices);
route.get('/service-rating/:id', readServeRating);
route.delete('/service-rating/:id', removeServeRating);
route.put('/service-rating/:id', updateServeRating);
route.get('/user-rated', verifyToken, getUserRated);
route.get('/service-used-by-user', verifyToken, getServiceOrderByUser);

export default route;
