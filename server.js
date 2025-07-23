const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");

dotenv.config();
connectDB();

const app = express();

// ✅ Use middlewares BEFORE routes
app.use(cors());
app.use(express.json()); // must come before authRoutes

// ✅ Routes
app.use("/api/auth", authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ✅ Socket.io
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // 👉 Listen for messages sent by clients
  socket.on("send_message", (data) => {
    console.log("📨 Message received:", data);

    // 🔁 Broadcast the message to all connected clients
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});


const path = require("path");

// Serve static frontend file
app.use(express.static(path.join(__dirname, "../Frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
