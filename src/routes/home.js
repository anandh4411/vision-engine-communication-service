const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Hey, this is vision-engine's user auth microservice" });
});

module.exports = router;
