const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configuration constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = 'uploads/';

/**
 * Configure multer disk storage
 * Saves files to the uploads directory with unique UUID-based filenames
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with UUID to prevent collisions
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

/**
 * File filter to only allow image files
 * Validates file type based on MIME type
 */
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed! Please upload a valid image file.'), false);
  }
};

/**
 * Configure multer instance with storage, file filter, and limits
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1 // Only allow 1 file per request
  }
});

/**
 * Upload middleware for handling single image file uploads
 * Wraps multer's single file upload with comprehensive error handling
 */
const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    // Handle multer-specific errors
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(400).json({ 
            error: 'File size too large. Maximum size is 5MB.' 
          });
        case 'LIMIT_FILE_COUNT':
          return res.status(400).json({ 
            error: 'Too many files uploaded. Only one file allowed per request.' 
          });
        case 'LIMIT_UNEXPECTED_FILE':
          return res.status(400).json({ 
            error: 'Unexpected field name. Use "image" as the field name for file uploads.' 
          });
        default:
          return res.status(400).json({ 
            error: `Upload error: ${err.message}` 
          });
      }
    } 
    
    // Handle other errors (like file filter errors)
    if (err) {
      return res.status(400).json({ 
        error: err.message 
      });
    }
    
    // No errors, continue to next middleware
    next();
  });
};

module.exports = uploadMiddleware;