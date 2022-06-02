import jwt from "jsonwebtoken";

// Sign token function
export const signToken = (payload: any, secret: string) => {
  return jwt.sign(payload, secret, { expiresIn: "2d" });
};

// Verify token
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
