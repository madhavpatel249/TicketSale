const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Middleware to process and optimize the uploaded image
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // Generate a unique filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;

    // Process the image with sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(800, 600, { // Resize to reasonable dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 }) // Convert to WebP format with 80% quality
      .toBuffer();

    // Store the processed image buffer
    req.file.processedBuffer = processedImage;
    req.file.filename = filename;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload: upload.single('image'),
  processImage
}; 