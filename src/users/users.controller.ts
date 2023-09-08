import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { HttpError } from "../errors/http.error";

export class UserController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      { path: "/register", method: "post", func: this.register },
      { path: "/login", method: "post", func: this.login },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    // this.send(res, 201, 'Hello')
    next(new HttpError(401, "Error of authorization", "login"));
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, "register");
  }
}
