import { RequestHandler } from 'express';
import 'reflect-metadata';

export function useMiddleware(middleware: RequestHandler){
    return function (target: any, key: string, desc: PropertyDescriptor){
        const middlewares = Reflect.getMetadata('middleware', target, key) || [];
        middlewares.push(middleware);
        Reflect.defineMetadata('middleware', [...middlewares, middleware], target, key);
    }
}