import express from 'express';
import { getAllCompanies, getCompanyById, updateCompany, deleteCompany, approveCompany } from '../controllers/companyController.js';
import { auth, isAdmin, isAdminOrCompany } from '../middleware/auth.js';

const router = express.Router();

// Get all companies (authenticated users)
router.get('/', auth, getAllCompanies);

// Get company by ID
router.get('/:id', auth, getCompanyById);

// Update company (company owner or admin)
router.put('/:id', auth, isAdminOrCompany, updateCompany);

// Delete company (admin only)
router.delete('/:id', auth, isAdmin, deleteCompany);

// Approve/suspend company (admin only)
router.put('/:id/approve', auth, isAdmin, approveCompany);

export default router;
