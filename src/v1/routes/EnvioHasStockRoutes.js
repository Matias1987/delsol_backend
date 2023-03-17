const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Obtener todos los envio producto");
});

router.get("/:clienteId", (req, res) => {
  res.send("Get an existing workout");
});

router.post("/", (req, res) => {
  res.send("Create a new workout");
});

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;