const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "../Frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // ✅ Set frontend origin explicitly
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("send_message", (data) => {
    console.log("📨 Message received:", data);
    io.emit("receive_message", data); // ✅ Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
    