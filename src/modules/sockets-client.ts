export {};
/*
import { SocketEventName,SocketUser } from "./types";
import socketIOClient from "socket.io-client";
const socketClient = socketIOClient();

interface EmitterCallback<T> {(data:T):void;}
interface WrappedClientSocket<T> {
  emit:(data: T) => SocketIOClient.Socket;
  on:(callback:EmitterCallback<T>) => SocketIOClient.Emitter;
  off:(callback:EmitterCallback<T>) => SocketIOClient.Emitter;
}

const createSocket = <T>(name:SocketEventName):WrappedClientSocket<T> => {
  return {
    emit:(data) => socketClient.emit(name,data),
    on:(callback) => socketClient.on(name,callback),
    off:(callback) => socketClient.off(name,callback),
  };
};
const chatMessageEvent:WrappedClientSocket<string> = createSocket("chat_message");
const SocketUserConnectedSocket:WrappedClientSocket<SocketUser> = createSocket("user_connected");

const messageList = document.querySelector("#chatbox");
const messageInput = document.querySelector("#my-message");
const sendButton = document.querySelector("#send");

chatMessageEvent.on((message) => messageList.appendChild(`<p>${message}</p>` as any));
chatMessageEvent.off((message) => OB.here("l",message));
chatMessageEvent.emit("Hey Doc!");
sendButton.addEventListener("click",() => chatMessageEvent.emit((messageInput as any).value));
*/