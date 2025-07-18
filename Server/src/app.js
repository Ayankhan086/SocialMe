import express from "express"
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174" , process.env.CORS_ORIGIN],
    credentials: true,
    allowedHeaders: ["cookie", "authorization"]
  },
  path: "/api/v1/socket.io"
})

app.use(cors(
  {
    origin: ["https://social-me-n9nv.vercel.app"],
    credentials: true
  }
))


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});


//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import followRouter from "./routes/follow.routes.js"
import postRouter from "./routes/post.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import messageRouter from "./routes/message.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/follows", followRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/messages", messageRouter)

app.use('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false
  })
})

app.use((req, res, next) => {
  console.log("Incoming headers:", req.headers);
  next();
});

app.set("io", io);


app.use(express.static("public"))


// Socket Io Logics 

export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

const mainNamespace = io.of("/");

try {
  mainNamespace.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    const userId = socket.handshake.query.userId;
    console.log("User ID:", userId);

    if (userId && userId !== "undefined") {
      if (!userSocketMap[userId]) {
        userSocketMap[userId] = new Set();
      }
      userSocketMap[userId].add(socket.id);
      console.log("Online users:", Object.keys(userSocketMap));

      // Send online users to all connected clients
      mainNamespace.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    // Moved disconnect outside the else block
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      if (userId && userSocketMap[userId]) {
        userSocketMap[userId].delete(socket.id);
        if (userSocketMap[userId].size === 0) {
          delete userSocketMap[userId];
        }
        mainNamespace.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

} catch (error) {
  mainNamespace.emit("connect_error", error);
}




export { app, io, server }