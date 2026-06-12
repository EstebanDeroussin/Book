const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validator = require("validator")

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({message: "Credential is not an email"})
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    return res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (error) {
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({message : "Email ou mot de passe requis."})
    }

    // * Vérifier si le user existe
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({message: "Itentifiants incorrets"})
    }

    // * vérifier le password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({message: "Identifiants incorrect."})
    }

    // * Générer le token 
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    return res.status(200).json({
      userId: user._id,
      token: token ,
    })
  } catch (error) {
    return res.status(500).json({message: "Erreur interne du serveur."})
  }
}
