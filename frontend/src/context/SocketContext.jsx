import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { SocketMessageListener } from "./SocketMessageListener";

const SocketContext = createContext(null);

function getSocketUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:9000";
  }
  return window.location.origin;
}

/** @type {'connected' | 'reconnecting' | 'disconnected' | 'error'} */
const STATUS = {
  CONNECTED: "connected",
  RECONNECTING: "reconnecting",
  DISCONNECTED: "disconnected",
  ERROR: "error",
};

export function SocketProvider({ children }) {
  const user = useSelector((state) => state.auth?.user);
  const accessToken = useSelector((state) => state.auth?.accessToken);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(STATUS.DISCONNECTED);
  const [errorMessage, setErrorMessage] = useState(null);
  const hasToastedErrorRef = useRef(false);

  useEffect(() => {
    if (!user) {
      setSocket(null);
      setConnected(false);
      setConnectionStatus(STATUS.DISCONNECTED);
      setErrorMessage(null);
      hasToastedErrorRef.current = false;
      return;
    }

    const socketUrl = getSocketUrl();
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      auth: { token: accessToken || undefined },
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      setConnected(true);
      setConnectionStatus(STATUS.CONNECTED);
      setErrorMessage(null);
      hasToastedErrorRef.current = false;
    });

    if (socketInstance.connected) {
      setConnected(true);
      setConnectionStatus(STATUS.CONNECTED);
      setErrorMessage(null);
    }

    socketInstance.on("disconnect", (reason) => {
      setConnected(false);
      setConnectionStatus(
        reason === "io server disconnect" ? STATUS.DISCONNECTED : STATUS.RECONNECTING
      );
    });

    socketInstance.on("connect_error", (err) => {
      setConnected(false);
      setConnectionStatus(STATUS.ERROR);
      setErrorMessage(err.message || "Connection failed");
      if (!hasToastedErrorRef.current) {
        toast.error("Connection failed. Reconnecting…");
        hasToastedErrorRef.current = true;
      }
    });

    socketInstance.on("reconnect_attempt", () => {
      setConnectionStatus(STATUS.RECONNECTING);
    });

    socketInstance.on("reconnect", () => {
      setConnected(true);
      setConnectionStatus(STATUS.CONNECTED);
      setErrorMessage(null);
      hasToastedErrorRef.current = false;
      toast.info("Back online");
    });

    socketInstance.on("reconnect_failed", () => {
      setConnectionStatus(STATUS.ERROR);
      setErrorMessage("Reconnection failed");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
      setSocket(null);
      setConnected(false);
      setConnectionStatus(STATUS.DISCONNECTED);
      setErrorMessage(null);
    };
  }, [user?.id, accessToken]);

  const value = {
    socket,
    connected,
    connectionStatus,
    errorMessage,
    STATUS,
  };

  return (
    <SocketContext.Provider value={value}>
      <SocketMessageListener />
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
