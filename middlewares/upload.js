// const multer = require("multer");
// const pass = require("path");

// const tempDir = pass.join(__dirname, "../", "temp");

// const multerConfig = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, tempDir);
//   },

//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
//   limits: {
//     fileSize: 2048,
//   },
// });

// const upload = multer({
//   storage: multerConfig,
// });

// module.exports = upload;
