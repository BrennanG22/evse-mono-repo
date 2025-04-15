
import React, { JSX } from "react";
import APIEntry from "./apiEntry";
import { readAPIConfigFile } from "./readFileComp";


export interface apiData {
  apiName: string;
  apiDescription: string;
  apiExample?: string;
  apiParameters?: string;
  endpoint: string;
  method: string;
  headers: JSON;
}

export default async function APIContainer() {
  const data: apiData[] | string = await readAPIConfigFile() ?? [];
  if (typeof data === "string") {
    return (
      <>
        {data}
      </>);
  }
  const tempRender: JSX.Element[] = [];
  let id = 0;
  data.forEach((data) => {
    tempRender.push(<APIEntry key={id} data={data} />)
    id++;
  })

  return (
    <>
      <div className="space-y-2">
        {tempRender}
      </div>
    </>
  )
}

