import { clear } from "console";
import ModbusRTU from "modbus-serial";


export class rule {
  id: number;
  type: string;
  registerType: string;
  active: boolean;
  interval: number;
  intervalId?: number | null;
  apiEndpoint: string;
  modbusRegister: number;
}

export default class modbusHelper {
  modbusClient: ModbusRTU
  typeEvalMap = new Map();
  rules: rule[] = [];
  activeIntervals: Map<number, ReturnType<typeof setInterval>> = new Map();


  constructor() {
    this.typeEvalMap.set("read-holding", (rule: rule) => {
      const lambda = (value: number[]) => {
        const returnData: number = value[0];
        fetch(rule.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain"
          },
          body: returnData.toString()
        })
          .catch((error) => {
            //Fail with no halt
            return null;
          })
      }
      const array: ((number) => void)[] = [];
      array.push(lambda);
      return this.setRecurringHoldingRead(rule.interval, array, rule.modbusRegister);
    });
    this.typeEvalMap.set("write-holding", (rule: rule) => {
      const lambda = async (): Promise<number> => {
        try {
          const response = await fetch(rule.apiEndpoint);
          const text = await response.text(); // Await the text() function
          return Number(text);
        } catch (err) {
          console.error(err);
          return 0; // Default value in case of an error
        }
      };
      return this.setRecurringHoldingWrite(rule.interval, lambda, rule.modbusRegister)
    });
    this.typeEvalMap.set("read-coil", this.setRecurringHoldingWrite);
  }

  getConnection(address: string, port: number, id: number) {
    if (!this.modbusClient.isOpen) {
      this.modbusClient.connectTCP(address, { port: port })
      .then(() => {console.log("Connection Started")})
      .catch((e) => {console.log(e)});
      this.modbusClient.setID(id);
    }
  }

  getConnectionStatus() {
    return this.modbusClient.isOpen;
  }

  closeConnection() {
    this.modbusClient.close();
  }

  clearIntervals() {
    this.activeIntervals.forEach((interval) => {
      clearInterval(interval);
    })
  }

  setRules(rulesToAdd) {
    this.rules.forEach((rule) => {
      clearInterval(this.activeIntervals.get(rule.id))
    })
    this.rules = [];
    this.addRules(rulesToAdd);
  }

  addRules(rulesToAdd: rule[]) {
    rulesToAdd.forEach((ruleData) => {
      if (this.rules.filter((testRule) => {
        testRule.id === ruleData.id
      })) {
        this.removeRules([ruleData.id])
      }
      this.rules.push(ruleData);
    })
    this.updateRules();
  }

  removeRules(ruleIds: number[]) {
    ruleIds.forEach((id) => {
      const removeIndex = this.rules.findIndex((testRule) => {
        testRule.id === id
      })
      if (removeIndex !== -1) {
        clearInterval(this.activeIntervals.get(id));
        this.rules.splice(removeIndex)
      }
    })
  }

  updateRules() {
    this.rules.forEach((rule) => {
      try {
        if (rule.active) {
          const callback = this.typeEvalMap.get(`${rule.type}-${rule.registerType}`);
          if (callback !== undefined) {
            this.activeIntervals.set(rule.id, callback(rule));
          }
        }
      }
      catch (error) {
      }
    })
  }

  //Add catch and error routing
  /**
   * Sets a recurring read of a Modbus resister, and returns the value to a callback
   * @param interval Time in ms between recurring event
   * @param callbackArray Array of functions that will be called after read
   * @param address Modbus address to read from
   */
  setRecurringHoldingRead(interval: number, callbackArray: ((value: number[]) => void)[], address: number) {
    return setInterval(() => {
      if (this.modbusClient !== undefined && this.modbusClient.isOpen) {
        this.modbusClient.readHoldingRegisters(address, 1)
          .then((data) => {
            callbackArray.forEach((callback) => {
              try {
                callback(data.data)
              }
              catch (error) {

              }
            });
          });
      }
    }, interval)
  }

  /**
   * Sets a recurring read of a Modbus coil, and returns the value to a callback
   * @param interval Time in ms between recurring event
   * @param callbackArray Array of functions that will be called after read
   * @param address Modbus address to read from
   */
  setRecurringCoilRead(interval: number, callbackArray: ((value: boolean[]) => void)[], address: number) {
    return setInterval(() => {
      if (this.modbusClient !== undefined && this.modbusClient.isOpen) {
        this.modbusClient.readCoils(address, 1)
          .then((data) => {
            callbackArray.forEach((callback) => {
              callback(data.data)
            });
          });
      }
    }, interval)
  }

  setRecurringHoldingWrite(interval: number, gatherDataFunction: () => Promise<number>, address: number) {
    return setInterval(async () => {
      if (this.modbusClient !== undefined && this.modbusClient.isOpen) {
        try {
          const data = await gatherDataFunction();
          this.modbusClient.writeRegister(address, data)
        }
        catch (err) {

        }
      }
    }, interval)
  }
}