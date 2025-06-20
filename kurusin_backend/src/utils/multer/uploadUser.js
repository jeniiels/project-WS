const multer = require("multer");
const path = require("path");
const storageUser = require("./storageUser");

const uploadUser = multer({
    storage: storageUser,
    limits: { fileSize: 200000 },
    fileFilter: (req, file, callback) => {
        const allowedFileType = /jpeg|jpg|png|gif/
        const fileExtension = path.extname(file.originalname).toLowerCase()
        const cekExtName = allowedFileType.test(fileExtension)
        const cekMimeType = allowedFileType.test(file.mimetype)
   
        if (cekExtName && cekMimeType) callback(null, true)
        else callback("error", false)
    }
});

module.exports = uploadUser;