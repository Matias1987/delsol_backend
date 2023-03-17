const express = require("express");
const router = express.Router();
const stockController = require("../../controllers/StockController")

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.get("/:stockId", (req, res) => {
  res.send("Get an existing workout");
});

router.post("/", (req, res) => {
  stockController.agregarStock(req,res);
});

router.patch("/:stockId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:stockId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;