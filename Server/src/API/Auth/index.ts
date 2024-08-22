import { Router } from 'express';
import controller from './Auth';

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post('/generate_password', controller.UpdatePassword)


export default router;