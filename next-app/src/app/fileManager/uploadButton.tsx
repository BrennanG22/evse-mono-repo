'use client';

import { getConfig } from "@/globalComponents/config/configContext";
import { useState } from "react";

export default function UploadButton() {
  const [file, setFile] = useState<File | null>(null);
  const config = getConfig();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${config.MODBUS_SERVER}/service/uploadFile`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("File uploaded successfully!");
    } else {
      alert("Upload failed!");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="border-2 border-gray-300 p-2 rounded-lg w-64 text-gray-700"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className={`${
          !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        } text-white py-2 px-6 rounded-lg transition-all duration-300`}
      >
        Upload
      </button>
    </div>
  );
  
}