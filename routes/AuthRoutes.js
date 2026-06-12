const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/Auth");
const rateLimit = require("../middleware/RateLimit");
const validatePassword = require("../middleware/PWDValidator");

router.post("/signup", validatePassword, authCtrl.signup);
router.post("/login", rateLimit, authCtrl.login);

module.exports = router;
