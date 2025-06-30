// src/context/SocketContext.js
import { createContext, useContext } from "react";

export const SocketContext = createContext(null);

// Custom hook to use the socket
export const useSocket = () => useContext(SocketContext);
