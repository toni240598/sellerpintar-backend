import express from "express";
import authRouter from "./auth.routes.js";
import projectRoutes from "./project.routes.js";

const router = express.Router();

router.use(authRouter); 
router.use(projectRoutes);
export default router;
