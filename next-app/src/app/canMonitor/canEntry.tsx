
import { canData } from "./canTable";

const CANEntry: React.FC<canData> = ({ time, canID, dataBytes }) => {
  const dataBytesRender = dataBytes.map(byte => byte.toString(16).padStart(2, '0'));
  const dataBytesRenderSpace = dataBytesRender.map(byte => byte + " ")
  const decData = dataBytes[7] + (256 * dataBytes[6]) + (65536 * dataBytes[5]) + (16777216 * dataBytes[4]);
  return (
    <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-200">
      <td className="p-3 text-center font-semibold text-gray-800">
        {time}
      </td>
      <td className="p-3 text-center font-semibold text-purple-600">
        {canID}
      </td>
      <td className="p-3 text-center text-green-600 font-mono">
        0x{dataBytesRenderSpace}
      </td>
      <td className="p-3 text-center text-red-500 font-mono">
        0x{`${dataBytesRender[1]} - ${dataBytes[1]}`}
      </td>
      <td className="p-3 text-center text-purple-700 font-mono">
        {`0x${dataBytesRender[4]} ${dataBytesRender[5]} ${dataBytesRender[6]} ${dataBytesRender[7]} - ${decData}`}
      </td>
    </tr>
  );
}

export default CANEntry;