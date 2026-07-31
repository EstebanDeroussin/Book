const passwordValidator = require('password-validator');

// Create a schema
const schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

const validatePassword = (req, res, next) => {
    const password = req.body.password;
    if (!schema.validate(password)) {
        return res.status(400).json({ message: "Mot de passe non valide. Il doit contenir au moins 8 caractères, une majuscule, une minuscule, deux chiffres et ne pas contenir d'espaces." });
    } else {
        next();
    }
}

module.exports = validatePassword;