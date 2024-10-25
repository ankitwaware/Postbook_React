import { Request, Response } from "express";
import prisma from "@repo/database/client";
import { isString, toNumber } from "lodash";
import { HTTP500Error, HttpStatusCode } from "../utils/errors";

export const users = async (req: Request, res: Response) => {
  try {
    console.log(res.locals.userId, "at user all");
    const allUsers = await prisma.user.findMany();
    return res.status(200).json(allUsers).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);

    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return res.json({ message: "deleteUser with id", id });
  } catch (error) {
    console.log(error);
    throw new HTTP500Error();
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    // validation
    if (!isString(username))
      return res.status(403).json({ message: "username must be valid string" });

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username,
      },
      select: {
        id: true,
        username: true,
      },
    });

    return res.json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
