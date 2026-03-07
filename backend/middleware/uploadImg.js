const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const userId = req.user.id;

        let folder = "./uploads";

        if(file.fieldname === "profilePic") {
            folder = `./uploads/users/${userId}/profilePics`;

        } else if(file.fieldname === "profileBackground") {
            folder = `./uploads/users/${userId}/profileBackground`;

        } else if(file.fieldname === "post") {
            folder = `./uploads/users/${userId}/posts`;

        }

        fs.mkdirSync(folder, { recursive: true });

        cb(null, folder);
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
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