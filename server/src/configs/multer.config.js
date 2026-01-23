// Configure Multer storage
import multer from "multer";

// setup the storage only add it and store the base64 in DB
const storage = multer.memoryStorage();

// Export the upload middleware
export const upload = multer({ storage: storage });