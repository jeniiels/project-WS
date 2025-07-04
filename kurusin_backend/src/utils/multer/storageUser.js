const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storageUser = multer.diskStorage({
    destination: (req, file, callback) => {
        const folderName = `uploads/user/${req.user.username}`;
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, { recursive: true })
        }
        callback(null, folderName)
    },
    filename: (req, file, callback) => {
        const fileExtension = path.extname(file.originalname).toLowerCase()
        const fileName = `pp${fileExtension}`
        callback(null, fileName)
    },
});

module.exports = storageUser;
