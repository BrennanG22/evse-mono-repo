import express from "express";
import fs from "fs";
import path from "path";
import logger from "../logger.js";
import multer from "multer"
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/Users/jbrgi/Code/evse-mono-repo/config'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({storage: storage})

router.post("/uploadFile", upload.single('file'), (req, res) => {
  res.send("Done");
});


router.get('/downloadFile/*', (req, res) => {
  const filePath = path.join(process.env.CONFIG_PATH ?? "", req.params[0]);
  logger.info(`Downloading file from: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found" });
  }
  else {
    res.setHeader("Content-Disposition", "attachment; filename=uploaded_file.txt");
    res.setHeader("Content-Type", "application/octet-stream");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
});

router.get('/getFiles', (req, res) => {
  const files: string[] = fs.readdirSync(process.env.CONFIG_PATH ?? "");
  res.send(JSON.stringify(files));
});

export default router;