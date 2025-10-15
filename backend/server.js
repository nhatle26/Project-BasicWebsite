const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Đường dẫn chính xác đến file db.json
const dbPath = path.join(__dirname, "../data/db.json");

// Đọc dữ liệu
let db = JSON.parse(fs.readFileSync(dbPath));

// GET tất cả sản phẩm
app.get("/products", (req, res) => {
  res.json(db.products);
});

// POST thêm sản phẩm
app.post("/products", (req, res) => {
  const newProduct = req.body;
  newProduct.id = Date.now();

  db.products.push(newProduct);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.status(201).json(newProduct);
});

app.listen(3000, () => 
  console.log("API server running on http://localhost:3000")
);
