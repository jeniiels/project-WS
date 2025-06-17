const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storageFood = multer.diskStorage({
    destination: (req, file, callback) => {
        const folderName = `uploads/food`
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, { recursive: true })
        }
        callback(null, folderName)
    },
    filename: (req, file, callback) => {
        const fileExtension = path.extname(file.originalname).toLowerCase()
        const fileName = `profpic${fileExtension}`
        callback(null, fileName)
    },
});
 
module.exports = storageFood;
