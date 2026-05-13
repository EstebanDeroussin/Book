const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const auth = require("./middleware/Auth");

const authRoutes = require("./routes/AuthRoutes");

const app = express();

// Sécurité
app.use(helmet());

// Autorise le frontend à communiquer avec le backend
app.use(cors());

// Permet de lire le JSON des requêtes
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connexion à MongoDB réussie !"))
  .catch((err) => console.log("❌ Connexion à MongoDB échouée !", err));

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;
