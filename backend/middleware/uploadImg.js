const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {

        const userId = req.user.id;
        
        let folder = "./uploads";

        if(file.fieldname === "profilePic") {
            folder = `./uploads/users/${userId}/profilePics`;

        } else if(file.fieldname === "profileBackground") {
            folder = `./uploads/users/${userId}/profileBackground`;

        } else if(file.fieldname === "imgs") {
            const postId = req.postId

            folder = `./uploads/users/${userId}/posts/${postId}`;
            
        }

        fs.mkdirSync(folder, { recursive: true });

        cb(null, folder);
    },

    filename: (req, file, cb) => {
        cb(null, Math.round(Math.random() * 1e9) + path.extname(file.originalname));
    },
});

const filter = (req, file, cb) => {
    if(file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
}

const upload = multer({ storage, fileFilter: filter });

module.exports = upload;