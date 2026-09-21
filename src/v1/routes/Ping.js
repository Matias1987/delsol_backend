const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // Prevent any browser or proxy from caching this response
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.status(200).send("OK");
});

// Also support HEAD requests for absolute minimal data usage
router.head("/api/ping", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.status(200).end();
});

module.exports = router;
