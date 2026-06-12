const sharp = require("sharp");
const path = require("path");

module.exports = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const existingImageFormat = ['jpg','jpeg','png','webp','avif'];

    const metadata = await sharp(req.file.buffer).metadata();
		if(existingImageFormat.includes(metadata.format) === false) {
			res.status(500).json({ message: 'Le format de l\'image n\'est pas accepté. Utilisez une image au format jpg, jpeg, png, webp ou avif'});
    }
    
    const filename = Date.now() + ".webp";

    await sharp(req.file.buffer)
      .resize(404, 648,{ fit: "cover" })
      .webp({ quality: 80 })
      .toFile(path.join("images", filename));

    req.file.filename = filename;
    next();
  } catch (error) {
    res.status(400).json({ message: "Impossible de traiter l'image" });
  }
};

