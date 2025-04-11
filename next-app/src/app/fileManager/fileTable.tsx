'use client';

import { JSX, useState } from "react";
import FileEntry from "./fileEntry";
import UploadButton from "./uploadButton";



function FileTable() {
  const [fileList, setFileList] = useState<JSX.Element[]>([]);
  getFiles().then((data) => setFileList(createFileEntryList(data)));

  return (
    <div className="flex-col space-y-2">
      <UploadButton/>
      {fileList}
    </div>);
}

async function getFiles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_MODBUS_SERVER}/service/getFiles`);
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

export default FileTable;