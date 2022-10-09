const multer = require("multer");
const path = require("path");

let storage = {
  productUpload: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./resource/img/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  }),

//   avatarUpload: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./resource/img/avatar");
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//     },
//   }),

  productThreeDUpload: multer.diskStorage({}),
};

let uploadImg = multer({ storage: storage.productUpload }).single("productImg");
// let userAvatar = multer({ storage: storage.avatarUpload }).single("userAvatar");
let productThreeD = multer({
  storage: storage.productThreeDUpload,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".glb") {
      cb(
        new Error("File type is not acceptable and supported. USE GLB only"),
        false
      );
      return;
    }
    cb(null, true);
  },
}).single("imgCloudinary");

module.exports = { uploadImg, productThreeD };
