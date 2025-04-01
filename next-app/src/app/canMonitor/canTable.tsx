'use client';

import { JSX, useEffect, useState } from "react";
import CANEntry from "@/app/canMonitor/canEntry";

export interface canData {
  time: string;
  canID: string;
  dataBytes: number[];
}

const CANTable = () => {

  const [currentGroupedData, setGroupedData] = useState<Map<string, canData[]>>();
  const [canEntryDisplay, setCanEntryDisplay] = useState<JSX.Element[]>([]);

  const [canStatusMessage, setCanStatusMessage] = useState<string>("Status: Offline");
  const [canStatusColour, setCanStatusColour] = useState<string>("bg-red-500");

  useEffect(() => {
    const interval = setInterval(() => {
      updateData();
    }, 5000);
    const statusInterval = setInterval(() => {
      updateStatus();
    }, 10000)
    return () => {clearInterval(interval); clearInterval(statusInterval)};
  }, []);


  useEffect(() => {
    updateDisplayRender();
  }, [currentGroupedData]);

  function updateData() {
    fetchData().then((data) => {
      setGroupedData(groupData(data));
    });
  }

  async function updateStatus(){
    const response = await fetch(`${process.env.NEXT_PUBLIC_MODBUS_SERVER}/proxy/api/system/can/can1`);
    if(!response.ok){
      setCanStatusColour("bg-red-500");
      setCanStatusMessage("Status: Offline");
    }
    else{
      setCanStatusColour("bg-green-500");
      setCanStatusMessage("Status: Online");
    }
  }

  function updateDisplayRender() {
    setCanEntryDisplay([]);
    const tempDisplay: JSX.Element[] = [];
    currentGroupedData?.forEach((data) => {
      const lastData = data[data.length - 1];
      tempDisplay.push(<CANEntry key={`${lastData.dataBytes}-${lastData.canID}`} time={lastData.time} canID={lastData.canID} dataBytes={lastData.dataBytes} />);
    })
    setCanEntryDisplay(tempDisplay);
  }

  updateStatus();

  return (
    <>
      <div className="flex items-center mb-4 space-x-3">
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition duration-200"
          onClick={startCAN}>
            Start CAN
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition duration-200"
          onClick={stopCAN}>
            Stop CAN
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`block w-3 h-3 rounded-full ${canStatusColour}`}></span>
          <span className="text-gray-700 font-medium">{canStatusMessage}</span>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-500 shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-3 border border-gray-600 text-left">Time Stamp</th>
            <th className="p-3 border border-gray-600 text-left">CAN ID</th>
            <th className="p-3 border border-gray-600 text-left">Data Bytes</th>
            <th className="p-3 border border-gray-600 text-left">Command Type (Hex - Dec)</th>
            <th className="p-3 border border-gray-600 text-left">Command Data (Hex - Dec)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {canEntryDisplay}
        </tbody>
      </table>
    </>
  )
}

async function fetchData(): Promise<canData[]> {
  const logRegex: RegExp = /\(([\d.]+)\)\s+can1\s+(0x[0-9a-fA-F]+)\s+\[8\]\s+([A-Za-z\d\s]+)/g
  const CANResponse = await fetch(process.env.NEXT_PUBLIC_MODBUS_SERVER + "/proxy/api/system/can/can1");

  const data = await CANResponse.text();
  let match: RegExpExecArray | null;
  const parsedData: canData[] = [];

  while ((match = logRegex.exec(data)) !== null) {
    const time = match[1];
    const canID = match[2];
    const dataBytes = match[3]
      .trim()
      .split(/\s+/)
      .map(byte => parseInt(byte, 16))
    parsedData.push({ time, canID, dataBytes });
  }
  return parsedData;
}

  function startCAN(){
    fetch(process.env.NEXT_PUBLIC_MODBUS_SERVER + "/proxy/api/system/can/can1", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).catch(error => console.error(error));
  }

  function stopCAN(){
    fetch(process.env.NEXT_PUBLIC_MODBUS_SERVER + "/proxy/api/system/can/can1", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).catch(error => console.error(error));
  }

function groupData(data: canData[]) {
  const groupedData: Map<string, canData[]> = new Map<string, canData[]>();
  data.reduce((acc: Map<string, canData[]>, obj: canData) => {
    const key = `${obj.canID}-${obj.dataBytes[1]}`;

    if (!acc.get(key)) {
      acc.set(key, [])
    }

    acc.get(key)?.push({ ...obj });
    return acc;
  }, groupedData);
  return groupedData;
}

export default CANTable;