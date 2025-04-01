import { useEffect, useState } from "react";

interface authBoxProps{
  currentState:number | null;
}

const AuthBox:React.FC<authBoxProps> = ({currentState}) => {
  const stateMap: string[] = [
    "Idle", 
    "Auth",
    "Parameter discovery",
    "Cable check",
    "Precharge",
    "Start Charging",
    "Charging",
    "Stopping Charge"
  ];

  const [stateText, setStateText] = useState<string | null>(null);

  useEffect(() => {
    if(currentState != null){
      setStateText(stateMap[currentState-1])
    }
  }, [currentState, stateMap]);

  function setAuth(authState: boolean){
    fetch("http://localhost:3000/api/auth?outlet=ccs", {
      method: 'POST',
      body: JSON.stringify({
        user: "evseTestApp",
        auth: authState,
        plug_type: "ccs"
      })
    })
    .catch(error => console.error('Error fetching data:', error));
  }
  
  return (
    <div className="justify-items-center">
      <input className="mt-2 border-solid border-2 box-border" type="text" placeholder="User Name"></input>
      <select className="box-border">
        <option>CCS</option>
      </select>
      <div className="w-full flex items-center">
        <button className="w-1/2 bg-green-500 rounded-full m-2" onClick={() => setAuth(true)}>Auth</button>
        <button className="w-1/2 bg-red-500 rounded-full m-2" onClick={() => setAuth(false)}>Stop</button>
      </div>
      <strong>State:</strong>
      <h1>{currentState!==null ? stateText : "Loading..."}</h1>
    </div>
  );
};
export default AuthBox;