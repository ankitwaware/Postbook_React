import * as jose from "jose";
import "dotenv/config";

export const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "secret3"
);

const alg = "HS256";
export const Issuer = "http://localhost:8080";
export const Audience = "Web";
export interface jwtPayload {}

export const generateJwtToken = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  return await new jose.SignJWT({ userId,email })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(Issuer)
    .setAudience(Audience)
    .setExpirationTime("4 days")
    .sign(secret);
};

export const verifyJWT = async (
  jwt: string,
  secret: Uint8Array,
  issuer: string,
  audience: string
) => {
  return await jose.jwtVerify(jwt, secret, {
    issuer: issuer,
    audience: audience,
  });
};
