import express from "express";

const app = express();

app.get("/", (req, res) => res.send("Hello there"));

const PORT = process.env.PORT || 3000;

// Login a user - POST /api/auth/login
// Logout a user - POST /api/auth/logout

// Get users - GET /api/users
// Create a user - POST /api/users
// Get user profile - GET /api/users/:userId
// Update profile - PUT /api/users/:userId

// Get chat list - GET /api/chats
// View messages in chat - GET /api/chats/:chatId/messages
// Send message - POST /api/chats/:chatId/messages

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Last updated ${new Date().toISOString()}`);
});
