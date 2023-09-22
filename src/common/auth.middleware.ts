import { IMiddleware } from './middleware.interface';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

interface IDecoded {
	email: string;
}

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, decoded) => {
				if (err) {
					next();
				} else if (decoded) {
					const payload = decoded as IDecoded;
					req.user = payload.email as string;
					next();
				}
			});
		}
		next();
	}
}
