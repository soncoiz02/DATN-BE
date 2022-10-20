import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import serviceRatingRouter from './routes/serviceRating';
import storeRouter from './routes/store';
import categoryRouter from './routes/category';
import ServiceRoute from './routes/service';
import PostCommentRoute from './routes/postcomment';
import PostRoute from './routes/post';
import orderStatusRoute from './routes/orderStatus';
import OrderRoute from './routes/order';
import OrderStepRoute from './routes/serviceStep';
import StoreNotifyRoute from './routes/storenotify';
import userRouter from './routes/user';
import authRouter from './routes/auth';
import storeMemberShip from './routes/storeMemberShip';
import storeRatingRouter from './routes/storeRating';
import userRole from './routes/userRole';
import UserNotifyRoute from './routes/usernotify';
import StaffRoute from './routes/staff';
import ActivityLog from './routes/activityLog';
import BillRoute from './routes/bill';

const app = express();
const swaggerJSDocs = YAML.load('./api.yaml');

const server = http.createServer(app);
dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/api', serviceRatingRouter);
app.use('/api', storeRouter);
app.use('/api', categoryRouter);
app.use('/api', PostCommentRoute);
app.use('/api', orderStatusRoute);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
app.use('/api', ServiceRoute);
app.use('/api', PostRoute);
app.use('/api', OrderRoute);
app.use('/api', OrderStepRoute);
app.use('/api', StoreNotifyRoute);
app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api', storeMemberShip);
app.use('/api', storeRatingRouter);
app.use('/api', UserNotifyRoute);
app.use('/api', userRole);
app.use('/api', StaffRoute);
app.use('/api', ActivityLog);
app.use('/api', BillRoute);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected'))
  .catch(() => console.log('Connect database failed'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
