import { Router } from "express";
import { deleteUser, updateUser, users } from "../controller/users";
import { isAuthenticated, isOwner } from "../middleware/authMiddleware";

const usersRouter:Router = Router();

// authmiddleware
usersRouter.use(isAuthenticated);

usersRouter.get("/all", users);

usersRouter.delete("/:id", isOwner, deleteUser);

usersRouter.patch("/:id", isOwner, updateUser);

export default usersRouter;
