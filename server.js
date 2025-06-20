const express = require("express");
const swaggerRouter = require("./router");
const app = express();

app.use("/", swaggerRouter);
app.get("/hello", (req, res) => {
  res.json({ message: "Hello, World dari server!" });
});

app.listen(5123, () => {
  console.log("Swagger UI tersedia di http://localhost:5123");
});
