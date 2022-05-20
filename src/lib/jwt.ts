import jwt from "jsonwebtoken";

export const signToken = (payload: any, secret: string) => {
  return jwt.sign(payload, secret, { expiresIn: "2d" });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
