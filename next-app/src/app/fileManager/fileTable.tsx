'use client';

import { JSX, useEffect, useState } from "react";
import FileEntry from "./fileEntry";
import UploadButton from "./uploadButton";
import ConfirmPage from "@/globalComponents/confirmPage";
import { getConfig } from "@/globalComponents/config/configContext";


function FileTable() {
  const [fileList, setFileList] = useState<JSX.Element[]>([]);
  const [warningOpen, setWarningOpen] = useState<boolean>(false);

  const config = getConfig();

  useEffect(() => {
    getFiles().then((data) => setFileList(createFileEntryList(data)));
  }, [])



  function openWarning() {
    setWarningOpen(true);
  }

  function closeWarning() {
    setWarningOpen(false);
  }

  async function startInit() {
    closeWarning();
    await fetch(`${config.MODBUS_SERVER}/service/resetConfigPath`);
  }

  async function getFiles() {
    const res = await fetch(`${config.MODBUS_SERVER}/service/getFiles`);
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        return data;
      }
      else {
        Promise.reject();
      }
    }
    return Promise.reject();
  }

  function createFileEntryList(files: Array<string>) {
    const entryList: JSX.Element[] = [];
    let id = 0;
    files.forEach((name) => {
      entryList.push(<FileEntry key={id} name={name} />);
      id++;
    });
    return entryList;
  }

  return (
    <div className="flex-col space-y-2">
      <UploadButton />
      <div className="flex justify-center items-center">
        <button onClick={openWarning}
          className="text-white py-2 px-6 rounded-lg transition-all duration-300 bg-red-500 hover:bg-red-600">Reset Files</button>
        {warningOpen &&
          (<ConfirmPage text="This action will reset the /app/config folder to default. Are you sure you want to proceed?"
            onConfirm={startInit}
            onCancel={closeWarning} />
          )}
      </div>
      {fileList}
    </div>);
}


export default FileTable;