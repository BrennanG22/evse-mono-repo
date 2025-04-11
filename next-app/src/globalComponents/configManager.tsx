import path from "path";
import * as fs from 'fs';


interface ConfigData {
  [key: string]: string; 
}

export async function readConfig(): Promise<Map<string, string> | null> {
  console.assert(process.env.CONFIG_PATH, "Missing CONFIG_PATH");
  console.log(process.env.CONFIG_PATH);

  try {
    const filePath = path.resolve(`${process.env.CONFIG_PATH}/env-next.json`);
    const fileOutput = fs.readFileSync(filePath, 'utf-8');
    const parsedData: ConfigData = JSON.parse(fileOutput);

    const dataMap = new Map<string, string>(Object.entries(parsedData));

    return dataMap;
  } catch (e) {
    console.error("Error parsing JSON API data:", e);
    return null;
  }
};

export default readConfig;
