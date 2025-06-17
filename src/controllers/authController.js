import { loginUser, registerUser } from "../services/authService.js";

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await registerUser(email, password);
    return res.status(201).json({ status: "success", data: user });
  } catch (err) {
    return res.status(400).json({ status: "error", message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token } = await loginUser(email, password);
    res.status(200).json({ status: "success", token });
  } catch (err) {
    res.status(401).json({ status: "error", message: err.message });
  }
};