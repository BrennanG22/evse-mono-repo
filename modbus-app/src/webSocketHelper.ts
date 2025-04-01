import logger from "./logger.js";

export default class webSocketHelper {
  private socketURL: string;
  private messages: string[] = [];
  private onMessageCallback: () => void;
  private tryingConnection: boolean;

  socket: WebSocket;

  constructor(url: string, callBack?: () => void) {
    if (callBack !== undefined) {
      this.onMessageCallback = callBack;
    }
    this.socketURL = url;
    this.startSocket().catch(() => {});
  };

  async startSocket(): Promise<void> {
    this.tryingConnection = true;
    return new Promise((resolve, reject) => {
      const attemptConnection = (retryCount: number) => {
        if (retryCount >= 2) {
          logger.error("WebSocket failed after 2 retries");
          this.tryingConnection = false;
          return reject("Websocket failed to connect");
        }
        logger.info(`Trying WebSocket Connection at: ${this.socketURL}`);
        this.socket = new WebSocket(this.socketURL);

        this.socket.onopen = () => {
          logger.info("WebSocket Connected");
          this.tryingConnection = false;
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.messages.push(event.data);
          if (this.onMessageCallback !== undefined) {
            this.onMessageCallback();
          }
        };

        this.socket.onerror = () => {
          logger.info(`WebSocket error, retrying (${retryCount + 1}/2)`);
          setTimeout(() => attemptConnection(retryCount + 1), 1000); // Wait 1 sec before retrying
        };

        this.socket.onclose = () => {
          logger.info("WebSocket closed unexpectedly, retrying...");
          setTimeout(() => attemptConnection(retryCount + 1), 1000);
        };
      };

      attemptConnection(0);
    });
  }

  async ensureSocketOpen(): Promise<void> {
    if (this.socket.readyState !== WebSocket.OPEN && !this.tryingConnection) {
      await this.startSocket()
      .then(() => {return Promise.resolve()})
      .catch(() => {return Promise.reject()})
    }
    else if(this.tryingConnection){
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