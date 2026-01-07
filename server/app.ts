import express from "express";

const app = express();

app.get("/", (req, res) => res.send("Hello there"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Last updated ${new Date().toISOString()}`);
});
