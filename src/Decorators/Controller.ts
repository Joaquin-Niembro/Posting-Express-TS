import 'reflect-metadata';
import { AppRouter } from '../AppRouter';
import { Methods } from './Methods';
import { RequestHandler, Response, Request, NextFunction } from 'express';

function bodyValidator(keys: string[]): RequestHandler {
	return function (req: Request, res: Response, next: NextFunction){
		if (!req.body) {
			res.send('Invalid request');
			return;
		}
		for (let key of keys) {
			if (!req.body[key]) {
				res.send(`Missing ${key}`);
				return;
			}
		}
		next();
	};
}

export function controller(routePrefix: string): Function{
    return function(target: Function): void{
        const router = AppRouter.getInstance();
        for(let key in target.prototype){
            const routeHandler = target.prototype[key]
            const path = Reflect.getMetadata('path', target.prototype, key);
            const method : Methods = Reflect.getMetadata('method', target.prototype, key);
            const middlewares = Reflect.getMetadata('middleware', target.prototype, key) || [];
            const requiredBodyProps = Reflect.getMetadata('validator', target.prototype, key) || [];
            const validator = bodyValidator(requiredBodyProps);

            if(path){
                router[method](`${routePrefix}${path}`, ...middlewares, validator, routeHandler);
            }
        }
    }
}