const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },

    filename: (req, file, cb) => {
        cb(null, file.filename + "-" + Date.now() + path.extname(file.originalname));
    },
});

const filter = (req, file, cb) => {
    if(file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
}

const upload = multer({ storage, filter });

module.exports = upload;