import crypto from "crypto";
const SECRET = "ANKIT-REST-API";
/**
 *
 * @returns Generates cryptographically strong pseudorandom data
 */
export const randomSalt = () => crypto.randomBytes(128).toString("base64");

export const generateHashedPass = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt || "", password].join("/"))
    .update(SECRET)
    .digest("hex");
};
