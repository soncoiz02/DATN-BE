import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import ServiceRoute from './routes/service';

const app = express();
const server = http.createServer(app);
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api", ServiceRoute)


mongoose.connect(process.env.MONGODB_URI).then(() =>
    console.log('Database connected')
).catch(() =>
    console.log('Connect database failed'))

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});