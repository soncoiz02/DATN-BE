import express from 'express';
import {
  getBestStatistic,
  getRevenueByDate,
  getRevenueByMonth,
  getServiceRevenue,
  getStatisticByDate,
  getStatisticPerMonth,
} from '../controllers/statistic';

const route = express.Router();

route.get('/get-best-statistic', getBestStatistic);
route.get('/get-statistic-by-date', getStatisticByDate);
route.get('/get-statistic-by-month', getStatisticPerMonth);
route.get('/get-service-revenue', getServiceRevenue);
route.get('/get-revenue-by-date', getRevenueByDate);
route.get('/get-revenue-by-month', getRevenueByMonth);

export default route;
