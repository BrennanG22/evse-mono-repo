'use server';

import path from "path";
import { apiData } from "./apiContainer";
import * as fs from 'fs';

export async function readAPIConfigFile(): Promise<apiData[] | string | null> {

  console.assert(process.env.API_CONFIG_PATH, "Missing API_CONFIG_PATH");
  console.log(process.env.API_CONFIG_PATH);
  try {
    const filePath = path.resolve(process.env.API_CONFIG_PATH ?? "");
    const fileOutput = fs.readFileSync(filePath ?? "", 'utf-8');
    const parsedData = JSON.parse(fileOutput);
    return parsedData;
  }
  catch (e) {
    console.error("Error parsing JSON API data:", e);
    return e instanceof Error ? e.message  + " " + process.env.API_CONFIG_PATH: null;
  }
};