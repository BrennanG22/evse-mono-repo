export default class webSocketHelper {
  private socketURL: string;
  private messages: string[] = [];
  private onMessageCallback: () => void;
  private onErrorCallback: () => void;

  socket: WebSocket | undefined;

  constructor(url: string, callBack: () => void, errorCallback: () => void) {
    this.onMessageCallback = callBack;
    this.socketURL = url;
    this.onErrorCallback = errorCallback;
    this.retrySocketConnection();
  };

  getLatestMessage() {
    return this.messages[this.messages.length - 1]
  }

  closeSocket() {
    this.socket?.close();
  }

  retrySocketConnection() {
    this.socket = new WebSocket(this.socketURL);
    this.socket.onmessage = (event) => {
      this.messages.push(event.data);
      this.onMessageCallback();
    };

    this.socket.onerror = () => {
      this.onErrorCallback();
    }
  }
}