const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/AuthRoutes");
const bookRoutes = require("./routes/BookRoutes");

const app = express();

// Sécurité (en autorisant le chargement des images cross-origin par le front)
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Autorise le frontend à communiquer avec le backend
app.use(cors(
  {origin: 'http://localhost:3000'}
));

app.use('/images', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//   );
//   next();
// });

// Permet de lire le JSON des requêtes
app.use(express.json());

// si l'url commence par /image svas chercher dan sle dossier images
app.use("/images", express.static("images"));

// Connexion à MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@${process.env.CLUSTER}/${process.env.DATABASE}?retryWrites=true&w=majority`,
  )
  .then(() => console.log("✅ Connexion à MongoDB réussie !"))
  .catch((err) => console.log("❌ Connexion à MongoDB échouée !", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

module.exports = app;
