export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    IM_A_TEAPOT = 418,
    MISDIRECTED_REQUEST = 421,
    UNPROCESSABLE_ENTITY = 422,
    LOCKED = 423,
    FAILED_DEPENDENCY = 424,
    UPGRADE_REQUIRED = 426,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
    VARIANT_ALSO_NEGOTIATES = 506,
    INSUFFICIENT_STORAGE = 507,
    LOOP_DETECTED = 508,
    NOT_EXTENDED = 510,
  }
  
  export class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;
    public readonly description: string;
  
    constructor(name: string, httpCode: HttpStatusCode, description: string) {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
  
      this.name = name;
      this.httpCode = httpCode;
      this.description = description;
  
      Error.captureStackTrace(this);
    }
  }
  
  //free to extend the BaseError
  export class APIError extends BaseError {
    constructor(
      name: string,
      httpCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
      description = "internal server error"
    ) {
      super(name, httpCode, description);
    }
  }
  
  // extend it for common errors
  export class HTTP400Error extends BaseError {
    constructor(description = "bad request") {
      super("NOT FOUND", HttpStatusCode.BAD_REQUEST, description);
    }
  }
  
  export class HTTP500Error extends BaseError {
    constructor(description = "Internal Server Error") {
      super("Internal Server Error", HttpStatusCode.INTERNAL_SERVER_ERROR, description);
    }
  }
  
  /* So how do you use it? Just throw this in
  const user = await User.getUserById(1);
  if (user === null)
   throw new APIError(
     'NOT FOUND',
     HttpStatusCode.NOT_FOUND,
     'detailed explanation'
   ); */
  
  // errors are caught to transfer to an error-handling middleware.
  /* try {
   userService.addNewUser(req.body).then((newUser: User) => {
     res.status(200).json(newUser);
   }).catch((error: Error) => {
     next(error) ***
   });
  } catch (error) {
   next(error);
  } */
  
  // get the unhandled rejection and throw it to another fallback handler we already have.
  // process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  //   throw reason;
  //  });
  
  // process.on('uncaughtException', (error: Error) => {
  //   errorHandler.handleError(error);
  //   if (!errorHandler.isTrustedError(error)) {
  //     process.exit(1);
  //   }
  //  });
  