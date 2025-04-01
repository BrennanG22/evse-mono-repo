import express from "express";

/**
 * This router will route requests to the SECC avoiding CORS issues
 */
const router = express.Router();
const baseSECCURL = process.env.SECC_HOST_URL

router.get('/*', (req, res) => {
  const fetchURL = new URL(req.url, baseSECCURL);
  fetch(fetchURL, {
    method: "GET",
    body: req.body
  })
  .then((response) => {
    if(!response.ok){
      res.status(400).send("Bad Response from: " + fetchURL)
    }
    else{
      return(response.text)
    }
  })
  .then((data) => {
    res.send(data);
  })
  .catch((e) => {
    res.status(400).send("Internal Proxy Error")
  })
})

router.post('/*', (req, res) => {
  const fetchURL = new URL(req.url, baseSECCURL);
  fetch(fetchURL, {
    method: "POST",
    body: req.body
  })
  .then((response) => {
    if(!response.ok){
      res.status(400).send("Bad Response from: " + fetchURL)
    }
    else{
      return(response.text)
    }
  })
  .then((data) => {
    res.send(data);
  })
  .catch((e) => {
    res.status(400).send("Internal Proxy Error")
  })
})

router.delete('/*', (req, res) => {
  const fetchURL = new URL(req.url, baseSECCURL);
  fetch(fetchURL, {
    method: "DELETE",
    body: req.body
  })
  .then((response) => {
    if(!response.ok){
      res.status(400).send("Bad Response from: " + fetchURL)
    }
    else{
      return(response.text)
    }
  })
  .then((data) => {
    res.send(data);
  })
  .catch((e) => {
    res.status(400).send("Internal Proxy Error")
  })
})

export default router;