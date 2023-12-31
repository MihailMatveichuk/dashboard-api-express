import { Router, Response } from 'express';
import { IRouter } from './routes.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;
	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): Response {
		res.type('applucation/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): Response {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IRouter[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((middleware) => {
				return middleware.execute.bind(middleware);
			});
			const handler = route.func.bind(this);
			const pipepline = middleware ? [...middleware, handler] : handler;
			this._router[route.method](route.path, pipepline);
		}
	}
}
