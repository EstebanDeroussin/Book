const express = require("express");
const router = express.Router();

const BookCtrl = require("../controllers/Book");
const multer = require("../middleware/multer");
const sharp = require("../middleware/sharp");
const auth = require("../middleware/Auth");

router.post("/", auth, multer, sharp, BookCtrl.createBook);
router.get("/", BookCtrl.getAllBooks);
router.get("/bestrating", BookCtrl.getBestRating);
router.delete("/:id", auth, BookCtrl.deleteBook);
router.get("/:id", BookCtrl.getOneBook);
router.put("/:id", auth, multer, sharp, BookCtrl.updateBook);
router.post("/:id/rating", auth, BookCtrl.rateBook);

module.exports = router;
