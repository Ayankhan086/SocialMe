import { createContext, useContext, useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import cookie from "js-cookie";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);
  const [newMessages, setNewMessages] = useState(null)
  const [newFollower, setNewFollower] = useState(null);
  const [newPost, setNewPost] = useState(null);
  const [postLikeEvent, setPostLikeEvent] = useState(null);
  const [newCommentEvent, setNewCommentEvent] = useState(null);

  useEffect(()=>{
    },[newMessages])

  const connectSocket = () => {
    const userId = cookie.get("CurrentUserId");
    const accessToken = cookie.get("accessToken");

    if (!accessToken || (socketRef.current?.connected)) {
      return;
    }

    if (!socketRef.current) {
      const serverUrl = import.meta.env.VITE_APP_SERVER_URL.replace("/api/v1", "");
      socketRef.current = io(serverUrl, {
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

    socketRef.current.on("getOnlineUsers", (userIds) => {
    
      setOnlineUsers(userIds);
    });

    socketRef.current.on("newMessage", (message) => {
      setNewMessages(message);
    })

    socketRef.current.on("newFollower", (data) => {
      setNewFollower(data);
    });

    socketRef.current.on("newPost", (post) => {
      setNewPost(post);
    });

    socketRef.current.on("postLikeToggled", (data) => {
      setPostLikeEvent(data);
    });

    socketRef.current.on("newComment", (data) => {
      setNewCommentEvent(data);
    });

    

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
        newMessages,
        newFollower,
        newPost,
        postLikeEvent,
        newCommentEvent
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};