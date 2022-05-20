import boom from "@hapi/boom";
import { NextFunction, Router, Request, Response } from "express";
import passport from "passport";
import { signin, signup, logout, resetPassword, publico, recoveryPassword } from "../controllers/auth.controller";
const router = Router();

// This method is for validate request body of Login route
const verifyLoginRequestBody = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email) return res.json({ error: "Falta el campo 'email'" }).status(400);
  if (!password) return res.json({ error: "Falta el campo 'password'" }).status(400);
  next();
};

router.post("/signin", verifyLoginRequestBody, signin);

router.post("/signup", signup);
router.post("/logout", logout);
router.patch("/resetPwd", passport.authenticate("jwt", { session: false }), resetPassword);
router.post("/recovery", recoveryPassword);
export default router;
