const multer = require("multer");

let storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
let upload = multer({ storage: storage, }).single("productImg");

module.exports = upload;
