import { Response, Request, NextFunction } from "express";
import { Issuer, secret, verifyJWT, Audience } from "../utils/jwt";
import { APIError, HttpStatusCode } from "../utils/errors";

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // userId from  auth middleware
    const currentUserId: string = res.locals.userId;

    // no id error
    if (!currentUserId)
      throw new APIError("not loged in", HttpStatusCode.UNAUTHORIZED);

    // no owner send error
    if (currentUserId !== id)
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "not owner",
      });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies["AUTH-TOKEN"];

    if (!sessionToken) return res.sendStatus(HttpStatusCode.UNAUTHORIZED);

    // verify cookie
    const { payload } = await verifyJWT(sessionToken, secret, Issuer, Audience);

    res.locals.userId = payload.userId as string;
    return next();
  } catch (error) {
    console.log(error);
    res.clearCookie("AUTH-TOKEN");
    return res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};
