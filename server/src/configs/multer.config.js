// Configure Multer storage
const storage = multer.diskStorage({
  destination: "./uploads/images", // Destination folder for uploaded images
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });