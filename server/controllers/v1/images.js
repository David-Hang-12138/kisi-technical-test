const path = require("path");
const fs = require("fs");
const multer = require("multer");
const logger = require("../../helpers/logger");

const imagesDir = path.join(__dirname, "../../public/images/");

const getImages = (req, res, next) => {
  const articlesFile = path.join(__dirname, "../../data/articles.json");

  // Read articles file and parse it to JSON object
  const articlesData = JSON.parse(fs.readFileSync(articlesFile));

  // Get list of image files in images directory
  const imagesFiles = fs.readdirSync(imagesDir);

  // Associate each article with its respective image (if any)
  const articlesWithImages = imagesFiles.sort().map((imagesFile, idx) => {
    const articleData = articlesData[idx % imagesFiles.length];
    const articlesWithImage = { image: `images/${imagesFile}`, ...articleData };
    return articlesWithImage;
  });

  // Send the complete list of articles with their images as response
  res.json(articlesWithImages);
};

const uploadImage = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "public/images");
    },
    filename: function (req, file, callback) {
      const temp_file_arr = file.originalname.split(".");
      const temp_file_name = temp_file_arr[0];
      const temp_file_ext = temp_file_arr[1];
      callback(
        null,
        `new_image_${Date.now()}_${temp_file_name}.${temp_file_ext}`
      );
    },
  });
  const upload = multer({ storage: storage }).single("image");

  upload(req, res, function (err) {
    if (err) {
      return res.end("Error uploading file.");
    } else {
      return res.end("File is uploaded successfully!");
    }
  });
};

module.exports = { getImages, uploadImage };
