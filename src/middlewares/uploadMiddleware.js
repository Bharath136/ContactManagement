// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configure Multer storage and file validation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.csv' && ext !== '.xlsx') {
        return cb(new Error('Only CSV and Excel files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
});

module.exports = upload;
