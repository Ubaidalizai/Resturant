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

// File filter (optional, only images)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

export const upload = multer({ storage, fileFilter });