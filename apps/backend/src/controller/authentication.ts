import { Request, Response } from "express";
import {
  loginSchema,
  signUpValues,
  signUpSchema,
  loginValues,
} from "@repo/schema/auth";
import { generateHashedPass, randomSalt } from "../utils/crypto";
import { generateJwtToken } from "../utils/jwt";
import { APIError, HttpStatusCode } from "../utils/errors";
import { dateStringAfterDays, millisecondsAfterdays } from "../utils/time";
import prisma from "@repo/database/client";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, displayName, password } = req.body as signUpValues;

    // validate the user data
    const parsedResult = signUpSchema.safeParse({
      email,
      username,
      displayName,
      password,
    });

    if (!parsedResult.success) {
      const formatedErrors = parsedResult.error.format();

      return res.status(HttpStatusCode.NOT_ACCEPTABLE).json({
        message: "invalid credentials",
        ...(formatedErrors.username && {
          username: formatedErrors.username._errors.at(0),
        }),
        ...(formatedErrors.displayName && {
          displayName: formatedErrors.displayName._errors.at(0),
        }),
        ...(formatedErrors.email && {
          email: formatedErrors.email._errors.at(0),
        }),
        ...(formatedErrors.password && {
          password: formatedErrors.password._errors.at(0),
        }),
      });
    }

    // existing user with email and username
    const existingUserEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    const existingUserUsername = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    if (existingUserEmail || existingUserUsername) {
      return res.status(HttpStatusCode.NOT_ACCEPTABLE).json({
        message: "invalid credentials",
        ...(existingUserEmail && { email: "Email Already exist" }),
        ...(existingUserUsername && { username: "username Already exist" }),
      });
    }

    // generate random salt and password
    const salt = randomSalt();
    const passwordHash = generateHashedPass(salt, password);
    // create user
    const createdUser = await prisma.user.create({
      data: {
        email,
        username,
        displayName,
        passwordHash,
        salt,
      },
      select: {
        id: true,
      },
    });

    // create user jwt session Token
    const jwtSessionToken = await generateJwtToken({
      userId: createdUser.id,
      email,
    });

    // cookie will be expire after 4 day
    const afrer4Days = millisecondsAfterdays(4);
    const expiresAtDate = dateStringAfterDays(4);

    // add session in prisma
    await prisma.session.create({
      data: {
        token: jwtSessionToken,
        userId: createdUser.id,
        expiresAt: expiresAtDate,
      },
    });

    // cookie will be expire after 4 day
    res.cookie("AUTH-TOKEN", jwtSessionToken, {
      maxAge: afrer4Days,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return res.status(HttpStatusCode.CREATED).json({
      message: "Successfully created user.",
      user: createdUser,
    });
  } catch (error) {
    console.log(error);
    throw new APIError("Something went wrong!");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as loginValues;

    // validation
    const parsedResult = loginSchema.safeParse({ email, password });

    if (!parsedResult.success) {
      const formatedErrors = parsedResult.error.format();

      return res.status(HttpStatusCode.NOT_ACCEPTABLE).json({
        message: "invalid credentials",
        ...(formatedErrors.email && {
          email: formatedErrors.email._errors.at(0),
        }),
        ...(formatedErrors.password && {
          password: formatedErrors.password._errors.at(0),
        }),
      });
    }

    // find user with email
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        passwordHash: true,
        salt: true,
      },
    });

    // no existing user with email
    if (!user) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        message: "invalid credentials",
        email: "No user with email",
      });
    }

    const expectedPasswordHash = generateHashedPass(user.salt!, password);

    // wrong password
    if (user.passwordHash !== expectedPasswordHash) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Wrong Password",
        password: "Wrong Password",
      });
    }

    // update user session Token
    const jwtSessionToken = await generateJwtToken({
      userId: user.id,
      email,
    });

    // cookie will be expire after 4 day
    const afrer4Days = millisecondsAfterdays(4);
    const expiresAtDate = dateStringAfterDays(4);

    // add session in prisma
    await prisma.session.create({
      data: {
        userId: user.id,
        token: jwtSessionToken,
        expiresAt: expiresAtDate,
      },
    });

    // cookie will expire after 4 day
    res.cookie("AUTH-TOKEN", jwtSessionToken, {
      maxAge: afrer4Days,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return res.status(HttpStatusCode.ACCEPTED).json({
      message: "Successfully login.",
      email,
    });
  } catch (error) {
    console.log(error);
    throw new APIError("Something went wrong!");
  }
};
