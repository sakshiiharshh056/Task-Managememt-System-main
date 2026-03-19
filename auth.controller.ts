import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";
import { createUser, validateUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await createUser(email, password);

  res.status(201).json({
    success: true,
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await validateUser(email, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.json({
    success: true,
    accessToken,
  });
};

export const refresh = (req: any, res: any) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    );

    const accessToken = generateAccessToken(decoded.userId);

    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logout = (req: any, res: any) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};