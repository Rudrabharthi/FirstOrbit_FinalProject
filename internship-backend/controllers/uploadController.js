import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { query } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${req.user.id}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const resumePath = `/uploads/resumes/${req.file.filename}`;
    
    // Update student's resume path
    await query(
      'UPDATE students SET resume_path = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      [resumePath, req.user.id]
    );
    
    res.json({ 
      message: 'Resume uploaded successfully',
      path: resumePath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Failed to upload resume', error: error.message });
  }
};

// Download resume (Company only)
export const downloadResume = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    res.download(filePath);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({ message: 'Failed to download resume', error: error.message });
  }
};

// Get student's resume
export const getMyResume = async (req, res) => {
  try {
    const result = await query(
      'SELECT resume_path FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0 || !result.rows[0].resume_path) {
      return res.status(404).json({ message: 'No resume found' });
    }
    
    res.json({ path: result.rows[0].resume_path });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Failed to get resume', error: error.message });
  }
};
