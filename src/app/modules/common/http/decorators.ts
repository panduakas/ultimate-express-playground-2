import 'reflect-metadata';
import { BaseDto } from '../dto/base.dto.js';

type RouteMeta = {
  method: 'get' | 'post';
  path: string;
  description?: string;
  query?: typeof BaseDto;
  body?: typeof BaseDto;
  response?: typeof BaseDto;
  handlerName: string | symbol;
};

const ROUTES_KEY = Symbol('routes');

type HasConstructor = { constructor: Function };

type MethodOpts = {
  description?: string;
  query?: typeof BaseDto;
  body?: typeof BaseDto;
  response?: typeof BaseDto;
};

export const Get =
  (path: string, opts: Omit<MethodOpts, 'body'>) =>
  (target: HasConstructor, propertyKey: string | symbol): void => {
    const routes = (Reflect.getMetadata(ROUTES_KEY, target.constructor) ?? []) as RouteMeta[];
    routes.push({
      method: 'get',
      path,
      description: opts.description,
      query: opts.query,
      response: opts.response,
      handlerName: propertyKey
    });
    Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
  };

export const Post =
  (path: string, opts: Omit<MethodOpts, 'query'>) =>
  (target: HasConstructor, propertyKey: string | symbol): void => {
    const routes = (Reflect.getMetadata(ROUTES_KEY, target.constructor) ?? []) as RouteMeta[];
    routes.push({
      method: 'post',
      path,
      description: opts.description,
      body: opts.body,
      response: opts.response,
      handlerName: propertyKey
    });
    Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
  };

export const getControllerRoutes = (ctor: Function): RouteMeta[] => {
  return (Reflect.getMetadata(ROUTES_KEY, ctor) ?? []) as RouteMeta[];
};
