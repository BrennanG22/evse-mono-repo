import express from "express";
import fs from "fs";
const router = express.Router();

router.post('/uploadFile', (req, res) => {

});

router.get('/downloadFile', (req, res) => {
  
});

router.get('/getFiles', (req, res) => {
  const files:string[] = fs.readdirSync('/app/config');
  res.send(files);
});

export default router;