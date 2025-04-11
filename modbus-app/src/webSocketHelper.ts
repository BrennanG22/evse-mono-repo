import logger from "./logger.js";
import { WebSocket } from "ws";

const MAX_RETRY: number = 2;

export default class webSocketHelper {
  private socketURL: string;
  private messages: string[] = [];
  private onMessageCallback: () => void;
  private tryingConnectionLock: boolean = false;

  socket: WebSocket;

  constructor(url: string, callBack?: () => void) {
    if (callBack !== undefined) {
      this.onMessageCallback = callBack;
    }
    this.socketURL = url;
    this.startSocket().catch(() => { });
  };

  async startSocket(): Promise<void> {
    this.tryingConnectionLock = true;
    return new Promise((resolve, reject) => {
      const attemptConnection = (retryCount: number) => {
        if (retryCount >= MAX_RETRY) {
          logger.error(`WebSocket failed after ${MAX_RETRY} retries`);
          this.tryingConnectionLock = false;
          return reject("Websocket failed to connect");
        }

        logger.info(`Trying WebSocket Connection at: ${this.socketURL}`);
        this.socket = new WebSocket(this.socketURL);

        this.socket.onopen = () => {
          logger.info("WebSocket Connected");
          this.tryingConnectionLock = false;
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.messages.push(event.data);
          if (this.onMessageCallback !== undefined) {
            this.onMessageCallback();
          }
        };

        this.socket.onerror = () => {
            logger.info(`WebSocket error, retrying (${retryCount + 1}/${MAX_RETRY})`);
            setTimeout(() => attemptConnection(retryCount + 1), 1000);
        };

        this.socket.onclose = () => {
            logger.info(`WebSocket closed unexpectedly`);
        };
      };

      attemptConnection(0);
    });
  }

  async ensureSocketOpen(): Promise<void> {
    if (this.socket.readyState !== WebSocket.OPEN && !this.tryingConnectionLock) {
      await this.startSocket()
        .then(() => { return Promise.resolve() })
        .catch(() => { return Promise.reject() })
    }
    else if (this.tryingConnectionLock) {
      logger.info("Connection refused due to socket actively connecting")
      return Promise.reject("Server is attempting to connect to WebSocket, please wait");
    }
    return Promise.resolve();
  }

  getLatestMessage() {
    return this.messages[this.messages.length - 1]
  }

  closeSocket() {
    this.socket.close();
  }
}