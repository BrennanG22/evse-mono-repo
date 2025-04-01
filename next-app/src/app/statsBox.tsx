interface StatsBoxProps {
  current: number | null;
  voltage: number | null;
  powerLimit: number | null;
  currentPower: number | null;
}

const StatsBox: React.FC<StatsBoxProps> = ({ current, voltage, powerLimit, currentPower}) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-center p-2">
      <h1>Current: <br/> {current ?? "Loading..."}</h1>
      <h1>Voltage: <br/> {voltage ?? "Loading..."}</h1>
      <h1>Power Limit: <br/> {powerLimit ?? "Loading..."}</h1>
      <h1>Current Power: <br/> {currentPower ?? "Loading..."}</h1>
    </div>
  );
}

export default StatsBox