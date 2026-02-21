import express from 'express';
import { getAdminAnalytics, getCompanyAnalytics, generateReport } from '../controllers/analyticsController.js';
import { auth, isAdmin, isCompany } from '../middleware/auth.js';

const router = express.Router();

// Admin analytics
router.get('/admin', auth, isAdmin, getAdminAnalytics);

// Company analytics
router.get('/company', auth, isCompany, getCompanyAnalytics);

// Generate report (Admin)
router.get('/report', auth, isAdmin, generateReport);

export default router;
