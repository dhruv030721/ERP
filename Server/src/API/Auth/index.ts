import { Router } from 'express';
import controller from './Auth';
import GeneratePasswordLinkVerification from './GeneratePasswordLinkVerification';

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post('/generate_password', controller.UpdatePassword)
router.post('/generate_password_link_verification', GeneratePasswordLinkVerification)

export default router;