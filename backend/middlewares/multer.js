import multer from "multer";
import path from "path";
import fs from "fs";

// Create 'temp_uploads' folder if it doesn't exist


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, "./public");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });
export default upload;
