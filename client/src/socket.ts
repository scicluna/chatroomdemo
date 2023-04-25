import { io } from "socket.io-client";

// const isProduction = process.env.NODE_ENV === "production";
// // const socketURL = isProduction
// //     ? "wss://voidchat.herokuapp.com"
// //     : "ws://localhost:3001";

const socket = io();

export default socket;