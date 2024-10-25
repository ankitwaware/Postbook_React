import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mainRouter from "./routes/router";
import { BaseError, HttpStatusCode } from "./utils/errors";

const app = express();

app.use(cors());

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// main routes
app.use(mainRouter);

// handle unexpected route
app.use("*", (req, res) => {
  return res.status(HttpStatusCode.NOT_FOUND).json({
    message:
      "The resource you are looking for could not be found on this server. Please check the URL for any errors and try again.If you believe this is an error, please contact support.",
  });
});

// global error handler
app.use(
  (
    err: BaseError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const httpCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    const errorName = "internal server error";
    const errorDescription = "Something went wrong. Try again";

    //res.sendStatus(200); // equivalent to res.status(200).send('OK')
    res.sendStatus(err.httpCode || httpCode);
    return res.json({
      message: err.name || errorName,
      description: err.description || errorDescription,
    });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
