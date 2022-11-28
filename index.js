import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import { Server } from 'socket.io';

import cron from 'node-cron';

import format from 'date-fns/format';
import serviceRatingRouter from './src/routes/serviceRating';
import storeRouter from './src/routes/store';
import categoryRouter from './src/routes/category';
import ServiceRoute from './src/routes/service';
import PostCommentRoute from './src/routes/postcomment';
import PostRoute from './src/routes/post';
import orderStatusRoute from './src/routes/orderStatus';
import OrderRoute from './src/routes/order';
import OrderStepRoute from './src/routes/serviceStep';
import StoreNotifyRoute from './src/routes/storenotify';
import userRouter from './src/routes/user';
import authRouter from './src/routes/auth';
import storeMemberShip from './src/routes/storeMemberShip';
import storeRatingRouter from './src/routes/storeRating';
import userRole from './src/routes/userRole';
import UserNotifyRoute from './src/routes/usernotify';
import StaffRoute from './src/routes/staff';
import ActivityLog from './src/routes/activityLog';
import BillRoute from './src/routes/bill';
import VoucherRoute from './src/routes/voucher';
import StatisticRoute from './src/routes/statistic';
import {
  createNotify,
  createUserNotify,
  updateNotifyStatus,
} from './src/socket/controller';

const app = express();
const swaggerJSDocs = YAML.load('./api.yaml');

const server = http.createServer(app);
dotenv.config();

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET, POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use('/', (req, res) => {
  res.json('Wellcome');
});
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
app.use('/api', VoucherRoute);
app.use('/api', StatisticRoute);

let clientId = '';

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('set-client-id', (data) => {
    clientId = data;
  });
  socket.on('send-notify', async (data) => {
    const newNotify = await createNotify(data.notifyData);
    io.emit('receive-new-order', data.storeId);
    io.emit('receive-notify', newNotify);
    io.emit('receive-new-notify');
  });
  socket.on('update-notify-status', async (data) => {
    await updateNotifyStatus(data);
    socket.emit('receive-new-notify');
  });
  socket.on('change-status', () => {
    io.emit('receive-status-change');
  });

  socket.on('send-notify-to-user', async (data) => {
    const newNotify = await createUserNotify(data);
    io.emit('receive-user-notify', newNotify);
  });

  socket.on('rated-service', () => {
    io.emit('receive-new-rated');
  });
});

const job = cron.schedule('30 * * * * *', () => {
  io.emit('receive-new-rated');
});

job.start();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected'))
  .catch(() => console.log('Connect database failed'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
