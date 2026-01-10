import { type WebsocketRequestHandler } from "express-ws";

const chatResponse: WebsocketRequestHandler = async (ws, req) => {
  ws.on("message", (message: string) => {
    console.log("Received: " + message);
    ws.send("pong");
  });
};

export { chatResponse };
