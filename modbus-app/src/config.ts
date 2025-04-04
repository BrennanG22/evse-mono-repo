import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Loads in the .env file in projects non persistent root directory
dotenv.config({ path: path.join(__dirname, '.env') });

//Loads in the .env file in the persistent volume config folder
if(process.env.CONFIG_PATH) dotenv.config({ path: path.join(process.env.CONFIG_PATH, '.env.modbus') })
  else logger.error("Missing CONFIG_PATH from root .env file. This is a critical error, the docker image needs to be rebuilt");
