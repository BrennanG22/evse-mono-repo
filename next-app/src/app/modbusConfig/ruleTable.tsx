'use client';

import { JSX, useEffect, useState } from "react";
import RuleBar from "./ruleBar";

export interface ruleData {
  id: number;
  active: boolean;
  type: string;
  registerType: string;
  interval: string;
  modbusRegister: string;
  dataParseStep: string;
  apiEndpoint: string;
}

const RuleTable = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>("Loading...");
  const [modbusConnectionError, setModbusConnectionError] = useState<boolean>(false);

  const [rulesDisplay, setRulesDisplay] = useState<JSX.Element[]>([]);
  const [rules, setRules] = useState<ruleData[]>(() => {
    return typeof window !== "undefined" ? JSON.parse(localStorage.getItem("rules") || "[]") : []
  });

  //Connection details
  const [ipAddress, setIpAddress] = useState<string>(() => { return typeof window !== "undefined" ? localStorage.getItem("ip") || "" : "" });
  const [port, setPort] = useState<string>(() => { return typeof window !== "undefined" ? localStorage.getItem("port") || "" : "" });
  const [clientId, setClientId] = useState<string>(() => { return typeof window !== "undefined" ? localStorage.getItem("clientId") || "" : "" });


  function addRule() {
    const tempRule: ruleData = {
      id: Date.now(),
      active: true,
      type: "read",
      registerType: "holding",
      interval: "",
      modbusRegister: "",
      dataParseStep: "",
      apiEndpoint: ""
    };
    setRules((prevRules) => {
      const newRules = prevRules.concat(tempRule);
      return newRules;
    });
  }

  function updateRuleRender() {
    const tempRulesDisplay: JSX.Element[] = [];
    rules.forEach((rule) => {
      tempRulesDisplay.push(<RuleBar key={rule.id} data={rule} updateRuleCallback={updateRuleData} removeRuleCallback={removeRule} />)
    });
    if (tempRulesDisplay.length === 0) {
      tempRulesDisplay.push(<h1 key={Date.now()}>Add a rule to get started</h1>)
    }
    setRulesDisplay(tempRulesDisplay);
  }

  function updateRuleData(data: ruleData) {
    const ruleToModify: ruleData | undefined = rules.find(rule => rule.id === data.id);
    if (ruleToModify) {
      ruleToModify.id = data.id;
      ruleToModify.active = data.active;
      ruleToModify.type = data.type;
      ruleToModify.interval = data.interval;
      ruleToModify.modbusRegister = data.modbusRegister;
      ruleToModify.dataParseStep = data.dataParseStep;
      ruleToModify.apiEndpoint = data.apiEndpoint;
      localStorage.setItem("rules", JSON.stringify(rules));
    }
  }

  function removeRule(id: number) {
    const indexToRemove = rules.findIndex(rule => rule.id === id);
    setRules((prevRules) => {
      const tempArray = [
        ...prevRules.slice(0, indexToRemove),
        ...prevRules.slice(indexToRemove + 1)
      ];
      return tempArray;
    });
  }

  useEffect(() => {
    localStorage.setItem("ip", ipAddress);
    localStorage.setItem("port", port);
    localStorage.setItem("clientId", clientId);
    localStorage.setItem("rules", JSON.stringify(rules));
  }, [ipAddress, port, clientId, rules]);

  useEffect(() => {
    updateRuleRender()
  }, [rules.length])

  useEffect(() => {
    const activeInterval = setInterval(() => getStatus(), 1000)
    return (() => { clearInterval(activeInterval) });
  }, []);


  function saveRules() {
    const sendRules: object[] = [];
    rules.forEach((rule) => {
      sendRules.push({
        id: rule.id,
        type: rule.type,
        registerType: rule.registerType,
        active: rule.active,
        interval: rule.interval,
        modbusRegister: rule.modbusRegister,
        apiEndpoint: rule.apiEndpoint
      })
    });
    fetch(process.env.NEXT_PUBLIC_MODBUS_SERVER + "/modbus/setRules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rules: sendRules
      })
    })
  }

  function startConnection() {
    fetch(process.env.NEXT_PUBLIC_MODBUS_SERVER + "/modbus/getModbusConnection", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: ipAddress,
        port: port,
        id: clientId
      }),
    })
      .catch((e) => console.log(e));
  };

  function stopConnection() {
    fetch(process.env.NEXT_PUBLIC_MODBUS_SERVER + "/modbus/stopModbusConnection", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: ipAddress,
        port: port,
        id: clientId
      }),
    })
      .catch((e) => console.log(e));
  }

  function getRulesFromSource() {
    fetch(process.env.NEXT_PUBLIC_MODBUS_SERVER + "/modbus/rules", {
      method: "GET"
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Fetch error")
      }
      return response.json()
    })
      .then((data) => {
        if (Array.isArray(data)) {
          setRules(data);
          updateRuleRender();
        }
      })
  }

  function getStatus() {
    fetch(process.env.NEXT_PUBLIC_MODBUS_SERVER + "/modbus/getModbusStatus", {
      method: "GET",
      signal: AbortSignal.timeout(500)
    })
      .then((response) => {
        if (!response.ok) {
          setConnectionStatus("Modbus Server Error");
          setModbusConnectionError(true);
        }
        return response.json();
      })
      .then((data => {
        setConnectionStatus(data.modbusConnectionStatus ? "Connection Open" : "Connection Closed");
        setModbusConnectionError(false);
      }))
      .catch(() => { setConnectionStatus("Modbus Server Error"); setModbusConnectionError(true) });
  }



  return (
    <div className="flex flex-col h-full">
      <div className="flex space-x-3 items-center m-1">
        <div className="">
          <h1 className="text-lg font-semibold">Connection Status: </h1>
          <div className="relative group">
            <h2 className="transition duration-200">
              {connectionStatus}
            </h2>
            {modbusConnectionError && (
              <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 delay-500 text-white text-xs rounded-md px-2 py-1 shadow-lg">
                Error connecting to the Modbus Server, ensure the server is running on the local machine
              </span>)}

          </div>
        </div>
        <button
          onClick={startConnection}
          className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200"
        >
          Start Connection
        </button>
        <button
          onClick={stopConnection}
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition duration-200"
        >
          Stop Connection
        </button>
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ip Address"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Port"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Client Id"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
      </div>
      <div className="bg-gray-500 h-0.5 w-full" />
      <div className="flex space-x-3 m-1">
        <button
          onClick={addRule}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Add Rule
        </button>
        <button
          onClick={getRulesFromSource}
          className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg shadow-md hover:bg-yellow-700 transition duration-200"
        >
          Refresh Rules
        </button>
        <button
          onClick={saveRules}
          className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition duration-200"
        >
          Save Rules
        </button>
      </div>
      <div className="bg-black h-1 w-full"></div>
      <div className="overflow-y-auto flex-1">{rulesDisplay}</div>
    </div>
  )
}

export default RuleTable;