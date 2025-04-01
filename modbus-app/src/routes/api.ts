import express from "express";
import webSocketHelper from "../webSocketHelper.js";
const router = express.Router();

if (!process.env.SECC_WEBSOCKET_URL) {
  console.log("Missing SECC_WEBSOCKET_URL in .env");
}
if (!process.env.SECC_HOST_URL) {
  console.log("Missing SECC_WEBSOCKET_URL in .env");
}
const webSocket = new webSocketHelper(process.env.SECC_WEBSOCKET_URL ?? "");

//Modbus Routes
//Read off SECC
router.get('/chargeState', (req, res) => {
  webSocket.ensureSocketOpen()
    .then(() => { res.send(JSON.parse(webSocket.getLatestMessage()).CCSCharging.toString()) })
    .catch(() => { res.status(400).send("Internal server error, see log file for detail") });
});

router.get('/batteryCapacity', (req, res) => {
  webSocket.ensureSocketOpen()
    .then(() => { res.send(JSON.parse(webSocket.getLatestMessage()).EVEnergyCapacity.toString()) })
    .catch(() => { res.status(400).send("Internal server error, see log file for detail") });
});

router.get('/soc', (req, res) => {
  webSocket.ensureSocketOpen()
    .then(() => { res.send(Math.floor(Math.abs((JSON.parse(webSocket.getLatestMessage()).soc) * 100)).toString()) })
    .catch(() => { res.status(400).send("Internal server error, see log file for detail") });
});

router.get('/voltage', (req, res) => {
  webSocket.ensureSocketOpen()
    .then(() => { res.send(JSON.parse(webSocket.getLatestMessage()).pv.toString()) })
    .catch(() => { res.status(400).send("Internal server error, see log file for detail") });
});

router.get('/current', (req, res) => {
  webSocket.ensureSocketOpen()
    .then(() => { res.send(JSON.parse(webSocket.getLatestMessage()).pc.toString()) })
    .catch(() => { res.status(400).send("Internal server error, see log file for detail") });
});

//Write to SECC
router.post('/setAuth', (req, res) => {
  fetch("http://localhost:3000/api/auth?outlet=ccs", {
    method: 'POST',
    body: JSON.stringify({
      user: "modbusServer",
      auth: JSON.parse(req.body).authState,
      plug_type: "ccs"
    })
  })
    .catch(error => console.error('Error fetching data:', error));
});

router.post('/setPowerLimit', async (req, res) => {
  // const outletType = req.body.outletType;
  await fetch(process.env.SECC_HOST_URL + "/api/outlets/ccs/coap/powercap", {
    method: "POST",
    body: JSON.stringify({
      PowerCapW: Number(req.body)
    })
  });
  res.send("Done");
});

export default router;