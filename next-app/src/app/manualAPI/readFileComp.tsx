'use server';

import path from "path";
import { apiData } from "./apiContainer";
import * as fs from 'fs';
import readConfig from "@/globalComponents/config/configManager";
import { redirect } from "next/navigation";

export async function readAPIConfigFile(): Promise<apiData[] | string | null> {
  const config = await readConfig();
  if (config === null){
    redirect('/');
  }
  const configPath = config.get('API_CONFIG_PATH')??'';
  try {
    const filePath = path.resolve(configPath);
    const fileOutput = fs.readFileSync(filePath ?? "", 'utf-8');
    const parsedData = JSON.parse(fileOutput);
    return parsedData;
  }
  catch (e) {
    console.error("Error parsing JSON API data:", e);
    return e instanceof Error ? e.message + " " + configPath : null;
  }
};