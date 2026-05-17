import { io } from "socket.io-client";

const SOCKET_URL = "http://192.168.2.131:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});