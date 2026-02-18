import express from 'express';
import { applyForInternship, getMyApplications, updateApplicationStatus, withdrawApplication, getAllApplications } from '../controllers/applicationController.js';
import { auth, isStudent, isAdminOrCompany, isAdmin } from '../middleware/auth.js';

import { upload } from '../config/multerConfig.js';

const router = express.Router();

// Student routes
router.post('/', auth, isStudent, upload.single('resume'), applyForInternship);
router.get('/my', auth, isStudent, getMyApplications);
router.delete('/:id', auth, isStudent, withdrawApplication);

// Company routes
router.put('/:id/status', auth, isAdminOrCompany, updateApplicationStatus);

// Admin routes
router.get('/', auth, isAdmin, getAllApplications);

export default router;
