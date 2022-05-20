import { NextFunction, Router, Request, Response } from "express";
import { JWTAuth } from "../lib/auth.handler";
import { signin, resetPassword } from "../controllers/auth.controller";
import ClsUser from "../class/ClsUser";
const router = Router();

// This method is for validate request body of Login route
const verifyLoginRequestBody = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email) return res.json({ error: "Falta el campo 'email'" }).status(400);
  if (!password) return res.json({ error: "Falta el campo 'password'" }).status(400);
  next();
};
// This method is for validate request body of Change Password route
const verifyChangePWDRequestBody = (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsUser.validateResetPWDData(req);
  if (!validate.validation) return res.json({ error: `${validate.message}` }).status(400);
  next();
};

router.post("/signin", verifyLoginRequestBody, signin);
router.put("/change-password", JWTAuth, verifyChangePWDRequestBody, resetPassword);

export default router;
