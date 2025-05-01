import express from 'express';
import { 
  requestExtension, 
  processExtension, 
  payForExtension, 
  verifyExtensionPayment,
  getRentalExtensions,
  getPendingExtensions,
  getAllExtensions
} from '../controllers/extensionController.js';
import { auth, admin } from '../middlewares/authenticationMiddleware.js';

const router = express.Router();

// User routes
router.post('/request', auth, requestExtension);
router.post('/pay', auth, payForExtension);
router.post('/verify-payment', auth, verifyExtensionPayment);
router.get('/rental/:rentalId', auth, getRentalExtensions);

// Admin routes
router.get('/pending', auth, admin, getPendingExtensions);
router.get('/all', auth, admin, getAllExtensions);
router.post('/process', auth, admin, processExtension);

export default router;