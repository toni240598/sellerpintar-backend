import express from "express";
import { body } from "express-validator";
import { login, register, verifyToken } from "../controllers/authController.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email tidak valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
    validateRequest,
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email tidak valid"),
    body("password").notEmpty().withMessage("Password wajib diisi"),
    validateRequest,
  ],
  login
);
router.get("/verify-token", verifyToken);
export default router;
