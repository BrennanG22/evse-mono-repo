import express from "express";
import ModbusRTU from "modbus-serial";
import modbusHelper from "../modbusHelper.js";
import { rule } from "../modbusHelper.js";

const router = express.Router();
const client = new ModbusRTU();
const modbus = new modbusHelper();

const callbackArray: ((number) => void)[] = [];
callbackArray.push((value) => {
  console.log(value);
})

modbus.modbusClient = client;


router.post('/getModbusConnection', (req, res) => {
  if (!modbus.modbusClient.isOpen) {
    console.log("Starting Connection");
    modbus.getConnection(req.body.address, Number(req.body.port), Number(req.body.id));
  }
  res.send("Done")
});

router.post('/stopModbusConnection', (req, res) => {
  modbus.modbusClient.close()
  res.send("Done");
});

router.get('/getModbusStatus', (req, res) => {
  res.send(JSON.stringify({
    modbusConnectionStatus: modbus.modbusClient.isOpen
  }));
})


router.get('/clearAll', (req, res) => {
  modbus.clearIntervals();
  res.send("Done");
});


router.get('/rules', (req, res) => {
  res.send(JSON.stringify(modbus.rules))
});

/**
 * Adds rules from a rule JSON
 */
router.post('/addRules', (req, res) => {
  const rules: rule[] = [];
  try {
    req.body.rules.forEach((rule) => {
      rules.push({
        id: rule.id,
        type: rule.type,
        registerType: rule.registerType,
        active: rule.active,
        interval: rule.interval,
        apiEndpoint: rule.apiEndpoint,
        modbusRegister: rule.modbusRegister
      })
    })
    modbus.addRules(rules);
  }
  catch {

  }
  res.send("Done");
});

router.post('/setRules', (req, res) => {
  const rules: rule[] = [];
  try {
    req.body.rules.forEach((rule) => {
      rules.push({
        id: rule.id,
        type: rule.type,
        registerType: rule.registerType,
        active: rule.active,
        interval: rule.interval,
        apiEndpoint: rule.apiEndpoint,
        modbusRegister: rule.modbusRegister
      })
    })
    modbus.setRules(rules);
  }
  catch {

  }
  res.send("Done");
});

/**
 * Sets a recurring read that will send the value of the read data to an endpoint specified 
 * by the caller. The request body needs {interval, address, endpoint}. Callback will be a post
 * with the value in plain text
 */
router.post('/setRecurringReadAPICallback', (req, res) => {
  const requestData = req.body;
  const lambda = (value: number[]) => {
    const returnData: number = value[0];
    fetch(requestData.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: returnData.toString()
    })
  }
  const array: ((number) => void)[] = [];
  array.push(lambda);
  modbus.setRecurringHoldingRead(requestData.interval, array, requestData.address);
  // rules.push({
  //   id: requestData.id,
  //   type: requestData.type,
  //   registerType: requestData.registerType,
  //   active: false,
  //   interval: requestData.interval,
  //   apiEndpoint: requestData.apiEndpoint,
  //   modbusRegister: requestData.modbusRegister
  // })
  res.send("Done");
});

/**
 * Sets a recurring write that will gather data from the specified endpoint, and will write the data 
 * to the requested modbus address. The request body needs {interval, address, endpoint}. The content type 
 * of the gather should be plain text
 */
router.post('/setRecurringWriteAPIGather', (req, res) => {
  const requestData = req.body;
  const lambda = async (): Promise<number> => {
    try {
      const response = await fetch(requestData.endpoint);
      const text = await response.text(); // Await the text() function
      return Number(text);
    } catch (err) {
      console.error(err);
      return 0; // Default value in case of an error
    }
  };
  modbus.setRecurringHoldingWrite(requestData.interval, lambda, requestData.address)
  res.send("Done");
});

/**
 * Sets a recurring read that will send the value of a coil to an endpoint specified 
 * by the caller. The request body needs {interval, address, endpoint}. Callback will be a post
 * with the value in plain text
 */
router.post('/setRecurringCoilReadAPICallback', (req, res) => {
  const requestData = req.body;
  const lambda = (value: boolean[]) => {
    const returnData: boolean = value[0];
    fetch(requestData.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: returnData.toString()
    })
  }
  const array: ((number) => void)[] = [];
  array.push(lambda);
  modbus.setRecurringCoilRead(requestData.interval, array, requestData.address);
  res.send("Done");
});

export default router;