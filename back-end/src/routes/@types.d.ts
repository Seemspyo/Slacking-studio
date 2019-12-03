import { Request, Response, NextFunction } from "express";


export interface RouteParam {
    method: 'get' | 'post' | 'put' | 'delete' | 'all';
    path: string;
    handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
}