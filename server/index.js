const socket = require("socket.io");
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const processingTeamRoutes = require("./routes/processingTeamRoutes");
const siteRoutes = require("./routes/siteRoutes");
const axios = require("axios");
const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const cookieParser = require("cookie-parser");

// Middleware
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

const sendMail = async (name, email) => {
  let mailOptions = {
    from: {
      name: "TNS Academy",
      address: "tnsacademy1@gmail.com",
    },
    to: email,
    subject: `Verification email from aero2astro`,
    html: `
       
      `,
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

app.use("/api/auth", userRoutes);
app.use("/api/processingTeam", processingTeamRoutes);
app.use("/api/site", siteRoutes);

app.post("/download-images", async (req, res) => {
  try {
    const { imageUrls } = req.body;
    console.log(imageUrls);
    const zipFileName = "images.zip";
    const zipFilePath = path.join(process.cwd(), zipFileName);
    const zipStream = fs.createWriteStream(zipFileName);
    // console.log(zipStream)
    const archive = archiver("zip");

    archive.pipe(zipStream);
    // console.log(arch)
    for (const imageUrl of imageUrls) {
      const response = await axios.get(imageUrl, { responseType: "stream" });
      console.log(response.data);
      archive.append(response.data, { name: imageUrl.split("/").pop() });
    }

    archive.finalize();
    // console.log(zipFileName)
    zipStream.on("close", () => {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${zipFileName}"`
      );
      res.download(zipFilePath);
      // fs.unlinkSync(zipFileName); // Remove the zip file after download
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

// app.post('/api/auth',async(req,res)=>{

// })

try {
  mongoose
    .connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("db connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
} catch (ex) {
  console.log(ex);
}

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server listening on PORT = ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("new user", socket.id);
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(userId);
  });
  socket.on("add-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to); //gets the user if he is online
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
  socket.on("refetch-user", (data) => {
    const sendUserSocket = onlineUsers.get(data.to); //gets the user if he is online
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("user-refetch", data);
    }
  });
  socket.on("refetch-post", (data) => {
    console.log(data);
    socket.broadcast.emit("refetch-post", data);
  });
  socket.on("refetch-messages", (data) => {
    const sendUserSocket = onlineUsers.get(data.to); //gets the user if he is online
    console.log("yes refetching messages");
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("messages-refetch", data);
    }
  });
  socket.on("add-user-to-room", ({ roomId, userId }) => {
    socket.join(roomId);
    socket.to(roomId).emit("new-user", userId);
  });
  socket.on("call-to-user", ({ callerId, user, roomId, peerId }) => {
    const sendUserSocket = onlineUsers.get(callerId); //gets the user if he is online
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-call", { roomId, user, peerId });
      socket.on("disconnect", () => {
        console.log("i ran");
        socket.to(roomId).emit("user-disconnected", { id: peerId });
      });
    }
  });
  socket.on("stop-ring", ({ callerId, roomId }) => {
    console.log(callerId, roomId);
    const sendUserSocket = onlineUsers.get(callerId); //gets the user if he is online
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("stop-ring", { id: roomId });
    }
  });
  socket.on("call-accepted", ({ user, roomId, peerId }) => {
    console.log(user, roomId);
    socket.join(roomId);
    socket.to(roomId).emit("new-user", { user, peerId });
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", { id: peerId });
    });
  });
  socket.on("user-left", ({ roomId, userId, user }) => {
    console.log(userId, roomId);
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", { userId, user });
  });
  socket.on("user-in-call", ({ currUser, user }) => {
    const sendUserSocket = onlineUsers.get(user.id); //gets the user if he is online
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("user-already-in-call", { currUser });
    }
  });
  socket.on("add-user-to-group-room", ({ roomId, userId }) => {
    socket.join(roomId);
    socket.to(roomId).emit("new-group-user", userId);
  });
  socket.on("call-to-group-user", ({ groupCaller, user, roomId, peerId }) => {
    const sendUserSocket = onlineUsers.get(groupCaller);
    if (sendUserSocket) {
      socket
        .to(sendUserSocket)
        .emit("incoming-group-call", { roomId, user, peerId });
      socket.on("disconnect", () => {
        console.log("userleft");
        socket
          .to(roomId)
          .emit("user-left-group", { peerId, user, userId: user.id });
      });
    }
  });
  socket.on("group-call-accepted", ({ user, roomId, peerId }) => {
    console.log(user, roomId);
    socket.join(roomId);
    socket.to(roomId).emit("new-group-user", { user, peerId });
    socket.on("disconnect", () => {
      console.log("userleft");
      socket
        .to(roomId)
        .emit("user-left-group", { peerId, user, userId: user.id });
    });
  });
  socket.on("stop-ring-group", ({ callerId, roomId }) => {
    console.log(callerId, roomId);
    if (Array.isArray(callerId)) {
      const sendUserSocket = callerId?.map((cal, j) => onlineUsers.get(cal));
      if (sendUserSocket) {
        for (let i = 0; i < sendUserSocket.length; i++) {
          socket.to(sendUserSocket[i]).emit("stop-ring-group", { id: roomId });
        }
      }
    }
  });
  socket.on("user-left-group", ({ roomId, userId, user, peerId }) => {
    console.log(userId, roomId);
    socket.leave(roomId);
    socket.to(roomId).emit("user-left-group", { userId, user, peerId });
  });
});

module.exports = app;
