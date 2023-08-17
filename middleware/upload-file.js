const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = file.fieldname == 'audio' ? 'audio' : 'image'
        cb(null, `uploads/${path}`);
    },
    filename: (req, file, cb) => {
        const name = file.fieldname == 'audio' ? '.mp3' : '.jpg'
        cb(null, file.fieldname +'-' + uuidv4() + name)
    },
})

module.exports = storage