require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const MenuItem = require("./schema");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => console.log(`Connected to MongoDB Atlas`))
  .catch((err) => console.error(`MongoDB connection error`, err));

app.post("/menu", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and Price are required",
      });
    }
    const newMenuItem = await MenuItem.create({
      name,
      description,
      price,
    });
    res.status(201).json({
      success: true,
      message: "New menu item created successfully",
      data: newMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating new item",
      error: error.message,
    });
  }
});

app.get("/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching menu items",
      error: error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port http://localhost:${process.env.PORT}`);
});
