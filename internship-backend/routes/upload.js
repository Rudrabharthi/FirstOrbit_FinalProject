import express from 'express';
import { upload, uploadResume, downloadResume, getMyResume } from '../controllers/uploadController.js';
import { auth, isStudent, isAdminOrCompany } from '../middleware/auth.js';

const router = express.Router();

// Upload resume (Student)
router.post('/resume', auth, isStudent, upload.single('resume'), uploadResume);

// Get my resume (Student)
router.get('/resume/my', auth, isStudent, getMyResume);

// Download resume (Company/Admin)
router.get('/resume/:filename', auth, isAdminOrCompany, downloadResume);

export default router;
