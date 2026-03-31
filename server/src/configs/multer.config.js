import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the folder exists
const uploadPath = path.join("uploads", "food_images");
fs.mkdirSync(uploadPath, { recursive: true });

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // e.g., food-1678901234.jpg
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});

// File filter: only allow images
const fileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        // Pass a custom error to be handled by error middleware
        const err = new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname);
        err.message = "Only image files are allowed!";
        cb(err, false);
    }
};

// 5MB file size limit
const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB
};

export const upload = multer({ storage, fileFilter, limits });