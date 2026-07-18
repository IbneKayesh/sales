const express = require("express");
const cors = require("cors");

const moduleRoutes = require("./routes/modules");
const menuRoutes = require("./routes/menus");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Module API Running",
  });
});

app.use("/api/modules", moduleRoutes);
app.use("/api/menus", menuRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});