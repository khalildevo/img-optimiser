const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static("./uploads"));

app.get("/", (req, res) => {
  return res.json({ message: "Hello world 🔥🇵🇹" });
});

app.post("/", upload.single("picture"), async (req, res) => {
  fs.access("./uploads", (error) => {
    if (error) {
      fs.mkdirSync("./uploads");
    }
  });
  
  const { buffer, originalname } = req.file;
  const j600 = `600/${originalname}.jpeg`;
  const j100= `100/${originalname}.jpeg`;
  await sharp(buffer)
    .jpeg({ quality: 60, mozjpeg:true })
    .resize({width:600})
    .toFile("./uploads/" + j600);
    await sharp(buffer)
    .jpeg({ quality: 100, mozjpeg:true })
    .resize({width:100})
    .sharpen({sigma:2})
    .toFile("./uploads/" + j100);
  const linkj600 = `http://localhost:3000/${j600}`;
  const linkj100 = `http://localhost:3000/${j100}`;
  return res.json({ linkj600,linkj100 });
});

app.listen(3000);