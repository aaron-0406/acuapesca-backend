import { Router } from 'express';
import passport from 'passport';
import { signin, signup, logout, whoami, resetPassword, publico, recoveryPassword } from '../controllers/auth.controller';
const router = Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/publico', publico);
router.post('/whoami', passport.authenticate('jwt', { session: false }), whoami);
router.patch('/resetPwd', passport.authenticate('jwt', { session: false }), resetPassword);
router.post('/recovery', recoveryPassword);

export default router;