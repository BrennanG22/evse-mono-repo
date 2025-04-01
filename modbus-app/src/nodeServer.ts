import "./config.js";

import express from "express";
import cors from "cors";

import modbusRoutes from './routes/modbusRoutes.js';
import apiRoutes from './routes/api.js';
import proxyRoutes from './routes/proxy.js';
import serviceRoutes from './routes/service.js';
import logger from './logger.js';

const app = express();

const port = process.env.PORT;
let data = 0;

app.use(express.json());
app.use(express.text());
app.use(cors());

app.use('/modbus', modbusRoutes);
app.use('/api', apiRoutes);
app.use('/proxy', proxyRoutes);
app.use('/service', serviceRoutes);

app.get('/', (req, res) => {
  data = data + 1;
  res.send(data.toString());
});

app.post('/', (req, res) => {
  console.log("Response: " + req.body);
  res.send(req.body);
});

app.get('/testCan', (req, res) => {
  res.send(`(0.009) can1 0x82204000 [8] 12 30 00 00 00 00 00 00
(0.035) can1 0x82206f0b [8] 13 30 00 00 00 00 00 20
(0.122) can1 0x82204000 [8] 12 08 00 00 00 00 00 00
(0.122) can1 0x82206f0b [8] 13 08 00 00 00 00 00 00
(0.122) can1 0x82204000 [8] 12 00 00 00 00 00 00 00
(0.122) can1 0x82206f0b [8] 13 00 00 00 00 07 9c 22
(0.123) can1 0x82204000 [8] 12 30 00 00 00 00 00 00
(0.123) can1 0x82206f0b [8] 13 30 00 00 00 00 00 20`);
})

app.listen(port, () => {
  logger.info(`Modbus server listening on port ${port}`)
});