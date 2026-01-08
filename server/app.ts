import express from "express";
import cors from "cors";

import usersRouter from "./routes/usersRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello there"));

const PORT = process.env.PORT || 3000;

// Login a user - POST /api/auth/login
// Logout a user - POST /api/auth/logout

app.use("/api/users", usersRouter);

// Get chat list - GET /api/chats
// View messages in chat - GET /api/chats/:chatId/messages
// Send message - POST /api/chats/:chatId/messages

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Last updated ${new Date().toISOString()}`);
});
