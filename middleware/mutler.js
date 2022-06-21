const multer = require("multer");

let storage = {
  productUpload: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./resource/img/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  }),

  avatarUpload: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./resource/img/avatar");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  }),
};

let uploadImg = multer({ storage: storage.productUpload }).single("productImg");
let userAvatar = multer({ storage: storage.avatarUpload }).single("userAvatar");

module.exports = { uploadImg, userAvatar };

