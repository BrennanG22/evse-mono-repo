import Link from 'next/link'

const Banner = () => {
  return (
    <div className="w-full bg-slate-700 flex items-center p-4 shadow-md">
      <div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg">
        <h1 className="text-3xl font-bold text-white">EVSE Test Software</h1>
      </div>
      <nav className="ml-6 flex space-x-6 text-lg">
        <Link href="/" className="text-white text-center hover:text-blue-300 transition">
          Status<br />Monitor
        </Link>
        <Link href="/canMonitor" className="text-white text-center hover:text-blue-300 transition">
          CAN<br />Monitor
        </Link>
        <Link href="/modbusConfig" className="text-white text-center content-center hover:text-blue-300 transition">
          Modbus <br />Configuration
        </Link>
        <Link href="/manualAPI" className="text-white text-center content-center hover:text-blue-300 transition">
          Manual <br /> API
        </Link>
        <Link href="/fileManager" className="text-white text-center content-center hover:text-blue-300 transition">
          File <br /> Manager
        </Link>
      </nav>
    </div>
  );
};

export default Banner;
