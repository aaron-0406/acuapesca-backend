import { Router } from "express";
import { indexRoute } from "../controllers/index.controller";

const router = Router();

router.get("/*", indexRoute);

export default router;
