// server.js
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const aiEngine = require("./ai_engine");
const dstConverter = require("./dst_converter");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "..")));

// Simple in-memory user store
let users = [];

// Signup
app.post("/api/signup", (req, res) => {
  const { email, password, type } = req.body;
  if(users.find(u=>u.email===email)){
    return res.json({ success:false, message:"Email already exists."});
  }
  users.push({ email, password, type });
  res.json({ success:true });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u=>u.email===email && u.password===password);
  if(user) return res.json({ success:true, user });
  res.json({ success:false, message:"Invalid credentials" });
});

// Chat
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  const reply = aiEngine.chat(message);
  res.json({ reply });
});

// Image generation
app.post("/api/image", async (req, res) => {
  try{
    const file = req.files ? req.files.file : null;
    const prompt = req.body.prompt;
    const url = await aiEngine.generateImage(prompt, file);
    res.json({ url });
  }catch(err){
    res.status(500).send("Error generating image");
  }
});

// Video generation
app.post("/api/video", async (req,res)=>{
  const { prompt } = req.body;
  const url = await aiEngine.generateVideo(prompt);
  res.json({ url });
});

// Math solver
app.post("/api/math", (req,res)=>{
  const { problem } = req.body;
  const result = aiEngine.solveMath(problem);
  res.json({ result });
});

// Business ideas
app.post("/api/business", (req,res)=>{
  const { prompt } = req.body;
  const idea = aiEngine.generateBusiness(prompt);
  res.json({ idea });
});

// Embroidery Conversion
app.post("/api/embroidery", async (req,res)=>{
  if(!req.files || !req.files.file) return res.status(400).send("No file uploaded.");
  const file = req.files.file;
  const dstBuffer = await dstConverter.convertToDST(file.data);
  res.setHeader("Content-Disposition", "attachment; filename=design.dst");
  res.setHeader("Content-Type", "application/octet-stream");
  res.send(dstBuffer);
});

// Start server
app.listen(PORT, ()=>console.log(`NovaSpace AI backend running on port ${PORT}`));
