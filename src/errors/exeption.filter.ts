import { NextFunction, Request, Response } from "express";
import { IExeptionFilter } from "./exeption.filter.interface";
import { HttpError } from "./http.error";
import { injectable, inject } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import "reflect-metadata";

@injectable()
export class ExeptionFilter implements IExeptionFilter {
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

  catch(
    error: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof HttpError) {
      this.logger.error(
        `[${error.context}] Error: ${error.statusCode} ${error.message}`
      );
      res.status(error.statusCode).send({ err: error.message });
    } else {
      this.logger.error(`${error.message}`);
      res.status(500).send({ err: error.message });
    }
  }
}
