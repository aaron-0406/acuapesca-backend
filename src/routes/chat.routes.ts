import { Router } from "express";
import { JWTAuth } from "../lib/auth.handler";
import { getContacts } from "../controllers/chat.controller";
const router = Router();

router.get("/contacts", JWTAuth, getContacts);
router.post("/", JWTAuth, getContacts);

export default router;
