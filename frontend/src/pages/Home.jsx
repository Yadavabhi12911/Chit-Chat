import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Home = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("chat message", (msg) => {
      console.log("Message from server:", msg);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  return <div>Home page ......</div>;
};

export default Home;
