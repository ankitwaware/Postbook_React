import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.send("hi well");
});

app.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
