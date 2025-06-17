import express from "express";
import { body } from "express-validator";
import { login, register } from "../controllers/authController.js";
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

export default router;
