import { Router } from "express";
import { login, registerUser } from "../controller/authentication";

const authenticationRouter: Router = Router();

authenticationRouter.post("/signup", registerUser);
authenticationRouter.get("/login", login);

export default authenticationRouter;
