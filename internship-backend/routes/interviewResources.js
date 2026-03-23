import express from 'express';
import { getAllResources, addResource, deleteResource } from '../controllers/interviewResourceController.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all resources (any authenticated user)
router.get('/', getAllResources);

// Admin-only routes
router.post('/', isAdmin, addResource);
router.delete('/:id', isAdmin, deleteResource);

export default router;
