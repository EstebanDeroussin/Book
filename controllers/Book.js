const fs = require("fs");

const Book = require("../models/Book");

exports.createBook = async (req, res, next) => {
  try {
    const bookData = JSON.parse(req.body.book);

    const book = new Book({
      ...bookData,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      ratings: [],
      averageRating: 0,
    });

    await book.save();
    res.status(201).json({ message: "Le Livre à été créé avec succès" });
  } catch (error) {
    res.status(400).json({ message: "Impossible de créer le livre" });
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ message: "impossible d'afficher les books" });
  }
};

exports.getOneBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findOne({ _id: bookId });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: "impossible d'afficher le livre actuel" });
  }
};

exports.getBestRating = async (req, res, next) => {
  try {
    const bestBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(bestBooks);
  } catch (error) {
    res
      .status(400)
      .json({ message: "impossible d'afficher les livres les mieux notés" });
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "unauthorized request" });
    } else {
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {});
      await Book.deleteOne(book);
      res.status(200).json({ message: "Livre supprimé avec succès !" });
    }
  } catch (error) {
    res.status(400).json({ message: "Impossible de supprimer le livre" });
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const bookData = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    } : { ...req.body };

    const book = await Book.findOne({_id: bookId });

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "unauthorized request" });
    } else {
      if (req.file) {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {});
      }
      await Book.updateOne({ _id: bookId }, { ...bookData, _id: bookId });
      res.status(200).json({ message: "Livre modifié avec succès !" });
    }
  } catch (error) {
    res.status(400).json({ message: "Impossible de modifier le livre" });
  }
}

exports.rateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    let rating = parseInt(req.body.rating) ??null
    let typeOk = typeof rating === "number"

    if (rating != null && typeOk && rating >= 0 && rating <= 5) {
  const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    const alreadyRated = book.ratings.find(r => r.userId === req.auth.userId);
    if (alreadyRated) {
      return res.status(400).json({ message: "Vous avez déjà noté ce livre" });
    }

    book.ratings.push({ userId: req.auth.userId, grade: rating });
    book.averageRating = book.ratings.reduce((acc, r) => acc + r.grade, 0) / book.ratings.length;

    await book.save();
    res.status(200).json({ message: "Livre noté avec succès !" });
    } else {
      res.status(400).json({ message: "Note invalide. La note doit être un nombre entre 0 et 5." });
    }
  }
  catch (error) {
    res.status(400).json({ message: "Impossible de noter le livre" });
  }
};

