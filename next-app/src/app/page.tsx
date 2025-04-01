'use client';

import AuthBox from "./authBox"
import { useEffect, useState } from "react";
import MonitorContainer from "./monitorContainer";
import StatsBox from "./statsBox";
import webSocketHelper from "./webSocketHelper";

const ParentComp = () => {

  const [currentState, setCurrentState] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [voltage, setVoltage] = useState<number | null>(null);
  const [powerLimit, setPowerLimit] = useState<number | null>(null);
  const [currentPower] = useState<number | null>(null);
  let stateSocket: webSocketHelper;

  useEffect(() => {
    console.assert(process.env.WEBSOCKET_URL, "Missing WEBSOCKET_URL in config");
    stateSocket = new webSocketHelper(process.env.WEBSOCKET_URL ?? "", newMessageCallback, errorMessageCallback);
    return () => {
      stateSocket.closeSocket();
    }
  }, []);

  function newMessageCallback() {
    const message = JSON.parse(stateSocket.getLatestMessage());

    setCurrentState(message.phs);
    setCurrent(message.pc);
    setVoltage(voltage == null ? 0 : voltage + 1);
    setPowerLimit(message.pLimit);
    //Set current power;
  }

  function errorMessageCallback() {
    
  }


  return (
    <div>
      <div className="w-full flex justify-center">
        <MonitorContainer name="Auth Settings">
          <AuthBox currentState={currentState} />
        </MonitorContainer>
        <MonitorContainer name="Stats">
          <StatsBox current={current} voltage={voltage} powerLimit={powerLimit} currentPower={currentPower} />
        </MonitorContainer>
      </div>
    </div>
  )
}

export default ParentComp