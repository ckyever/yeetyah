import cors from "cors";
import express from "express";
import expressWs from "express-ws";

import authRouter from "./routes/authRouter";
import chatRouter from "./routes/chatRouter";
import usersRouter from "./routes/usersRouter";

const appBase = express();
const { app } = expressWs(appBase);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello there"));

const PORT = process.env.PORT || 3000;

// Logout a user - POST /api/auth/logout

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use("/api/chat", chatRouter);

// Get chat list - GET /api/chats
// View messages in chat - GET /api/chats/:chatId/messages
// Send message - POST /api/chats/:chatId/messages

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Last updated ${new Date().toISOString()}`);
});
