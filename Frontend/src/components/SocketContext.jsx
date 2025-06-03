import { createContext, useContext, useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import cookie from "js-cookie";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);
  const [newMessages, setNewMessages] = useState([])

  useEffect(()=>{
      console.log("New Messages ", newMessages);
    },[newMessages])

  const connectSocket = () => {
    const userId = cookie.get("CurrentUserId");
    const accessToken = cookie.get("accessToken");

    if (!accessToken || (socketRef.current?.connected)) {
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8000", {
        withCredentials: true,
        autoConnect: false,
        query: { userId },
        path: "/api/v1/socket.io",
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      // Setup event listeners only once
    }
    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.log('Connection error:', err.message);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current.on("getOnlineUsers", (userIds) => {
      console.log("Online users updated:", userIds);
      setOnlineUsers(userIds);
    });

    socketRef.current.on("newMessage", (message) => {
      setNewMessages(prev => [...prev, message])
    })

    

    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setOnlineUsers([]);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        connectSocket,
        disconnectSocket,
        socket: socketRef,
        onlineUsers,
        newMessages
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};