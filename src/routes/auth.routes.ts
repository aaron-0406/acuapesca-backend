import { Router } from "express";
import passport from "passport";
import { signin, signup, logout, resetPassword, publico, recoveryPassword } from "../controllers/auth.controller";
const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/logout", logout);
router.patch("/resetPwd", passport.authenticate("jwt", { session: false }), resetPassword);
router.post("/recovery", recoveryPassword);

export default router;
