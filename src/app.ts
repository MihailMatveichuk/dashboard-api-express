import express, { Express } from "express";
import { Server } from "http";
import { UserController } from "./users/users.controller";
import { ILogger } from "./logger/logger.interface";
import { injectable, inject } from "inversify";
import { TYPES } from "./types";
import "reflect-metadata";
import { ExeptionFilter } from "./errors/exeption.filter";
import { IExeptionFilter } from "./errors/exeption.filter.interface";

@injectable()
export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IUserController) private userController: UserController,
    @inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter
  ) {
    this.app = express();
    this.port = 8000;
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExeptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExeptionFilters();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server was launched on http://localhost:${this.port}`);
  }
}
