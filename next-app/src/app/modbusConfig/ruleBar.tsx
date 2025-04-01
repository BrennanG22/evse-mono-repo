'use client';

import { SetStateAction, useEffect, useState } from "react";
import { ruleData } from "./ruleTable";

interface RuleBarProps {
  data: ruleData;
  updateRuleCallback: (data: ruleData) => void;
  removeRuleCallback: (id: number) => void;
}

/**
 * Rule bar that will allow users to make a new rule, or edit an existing one for modbus calls
 * Read rule: Interval (ms), modbus address, transformation step, api to send it to
 * Write rule: Interval (ms), API to call, parse instructions, register to write to
 */
const RuleBar: React.FC<RuleBarProps> = ({ data, updateRuleCallback, removeRuleCallback }) => {
  const [selectedType, setSelectedType] = useState(data.type);
  const [interval, setInterval] = useState(data.interval);
  const [modbusRegister, setModbusRegister] = useState(data.modbusRegister);
  const [apiEndpoint, setAPIEndpoint] = useState(data.apiEndpoint);
  const [localData, setLocalData] = useState<ruleData>(data);

  function removeRule() {
    removeRuleCallback(localData.id);
  }

  useEffect(() => {
    localData.interval = interval;
    localData.modbusRegister = modbusRegister;
    localData.apiEndpoint = apiEndpoint;
    updateRuleCallback(localData);
  }, [interval, modbusRegister, apiEndpoint]);


  const ruleTypeChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedType(event.target.value);
    setLocalData((prevData) => { prevData.type = event.target.value.toString(); return prevData })
    updateRuleCallback(localData);
  };

  return (
    <div className="flex items-center bg-gray-100 p-4 space-x-4 border-2 border-gray-300 rounded-lg shadow-md">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Rule Status</h3>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Rule Type</h3>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedType}
          onChange={ruleTypeChange}
        >
          <option value="read">Read</option>
          <option value="write">Write</option>
        </select>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Interval (ms)</h3>
        <input
          className="w-[7ch] px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Modbus Address</h3>
        <input
          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={modbusRegister}
          onChange={(e) => setModbusRegister(e.target.value)}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Data Parse Step</h3>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>None</option>
        </select>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700">API Endpoint</h3>
        <input
          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={apiEndpoint}
          onChange={(e) => setAPIEndpoint(e.target.value)}
        />
      </div>
      <button
        onClick={removeRule}
        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition duration-200"
      >
        Remove Rule
      </button>
    </div>
  );
}

export default RuleBar;