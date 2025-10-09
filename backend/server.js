const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// đường dẫn tương đối (Render cần)
const dbPath = path.join(__dirname, "data/db.json");

// đọc dữ liệu
let db = JSON.parse(fs.readFileSync(dbPath));

// API
app.get("/products", (req, res) => res.json(db.products));

app.post("/products", (req, res) => {
  const newProduct = req.body;
  newProduct.id = Date.now();
  db.products.push(newProduct);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json(newProduct);
});

// port của Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
