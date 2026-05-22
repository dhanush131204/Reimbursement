import express from 'express';
import { getClaims, createClaim, updateClaimStatus } from '../controllers/claimController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getClaims)
  .post(protect, createClaim);

router.route('/:id/status')
  .patch(protect, admin, updateClaimStatus);

export default router;
