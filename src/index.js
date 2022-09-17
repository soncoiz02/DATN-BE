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
import PostRoute from './routes/post';
import orderStatusRoute from './routes/orderStatus';

const app = express();
const swaggerJSDocs = YAML.load('./api.yaml');

const server = http.createServer(app);
dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/api', serviceRatingRouter);
app.use('/api', storeRouter);
app.use('/api', categoryRouter);
app.use('/api', orderStatusRoute);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
app.use('/api', ServiceRoute);
app.use('/api', PostRoute);
app.use('/api', );

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Database connected'))
    .catch(() => console.log('Connect database failed'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});