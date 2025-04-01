import pino from 'pino';
import fs from 'fs';
import path from 'path';

// Define log file path
const logFilePath = path.join('.', 'logs', 'app.log');

fs.writeFileSync(logFilePath, '');

// Create a write stream for logging to a file
const logFileStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Create the logger instance with multi-stream support
const logger = pino(
  {
    level: 'info',  // Default log level
  },
  pino.multistream([
    { stream: logFileStream },   // Log to file
    {
      stream: pino.transport({
        target: 'pino-pretty', // Pretty-print for console
        options: {
          colorize: true, // Enable colors
          translateTime: 'SYS:standard', // Format timestamps
          singleLine: true, // Keep logs in a single line
        },
      }),
    }, // Pretty-printed console output
  ])
);

export default logger;
