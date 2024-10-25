import { Router, Response, Request } from "express";
import authenticationRouter from "./authRoutes";
import usersRouter from "./users";

const mainRouter:Router = Router();

mainRouter.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Healthy from Server",
  });
});
       
mainRouter.use("/auth", authenticationRouter);
mainRouter.use("/user", usersRouter);

export default mainRouter;
