import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Replace with your socket server URL

export default socket;
