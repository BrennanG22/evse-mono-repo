import express from "express";
import fs from "fs";
import path from "path";
import logger from "../logger.js";
import multer from "multer";
import {spawn} from "child_process";
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.CONFIG_PATH??""); 
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

router.get('/resetConfigPath', (req, res) => {
  const script = spawn(process.env.INIT_SCRIPT_PATH??"");
  
  script.stdout.on('data', (data) => {
    logger.info(`stdout: ${data}`);
  });
  
  script.stderr.on('data', (data) => {
    logger.error(`stderr: ${data}`);
  });
  
  script.on('close', (code) => {
    logger.info(`Shell script exited with code ${code}`);
  });

  res.send();
})

export default router;