import { IWebSocketClient } from "../../data/interfaces";

export default class Trader {
  socket: IWebSocketClient

  constructor(ws: IWebSocketClient) {
    this.socket = ws
  }
}