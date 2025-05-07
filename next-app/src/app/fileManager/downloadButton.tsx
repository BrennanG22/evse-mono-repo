import { getConfig } from "@/globalComponents/config/configContext";

type DownloadButtonProps = {
  fileName: string;
};

export default function DownloadButton({ fileName }: DownloadButtonProps) {
  const handleDownload = async () => {
    const config = getConfig();
    const response = await fetch(`${config.MODBUS_SERVER}/service/downloadFile/${fileName}`);
    if (!response.ok) return alert("Download failed: " + await response.text());

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300"
    >
      Download
    </button>
  );
}
