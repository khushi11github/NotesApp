const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const userRouter = require('./api/user');
const notesRouter = require("./api/Notes");
const folderRouter = require("./api/folder");
const nodemailer = require("nodemailer");

require('dotenv').config();
app.use(express.json());
// Importing the notes router


app.use(cors());


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend origin
    methods: ["GET", "POST"],
  }
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinNote", (noteId) => {
    socket.join(noteId); // user joins the room for that note
    console.log(`User joined room for note ${noteId}`);
  });

  socket.on("sendNote", ({ noteId, content }) => {
    // Broadcast updated content to everyone except sender in the note room
    socket.to(noteId).emit("receiveNote", content);
    console.log(`Broadcasting updated content for note ${noteId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});



//moongoose connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  }
  )
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  }
);

//routes api

app.use("/api/auth", require("./api/auth")); // auth routes
app.use("/api/notes", notesRouter);
app.use('/api/users', userRouter);
app.use("/api/folders", folderRouter); // folder routes


    // Handle note updates  
server.listen(8000, () => {
    console.log("Server listening on port 8000");
    });