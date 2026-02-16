import express from 'express';
import { body, validationResult } from 'express-validator';
import { getAllInternships, getInternshipById, createInternship, updateInternship, deleteInternship, getApplicants, getMyInternships } from '../controllers/internshipController.js';
import { auth, isCompany, isAdminOrCompany } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Public routes
router.get('/', getAllInternships);

// Company routes - must be before /:id to avoid being caught by it
router.get('/my', auth, isCompany, getMyInternships);

// Get internship by ID
router.get('/:id', getInternshipById);

router.post('/', auth, isCompany, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
], validate, createInternship);

router.put('/:id', auth, isAdminOrCompany, updateInternship);
router.delete('/:id', auth, isAdminOrCompany, deleteInternship);

// Get applicants for an internship
router.get('/:id/applicants', auth, isAdminOrCompany, getApplicants);

export default router;
