/** Custom Modules */
import Route from "./route";

/** Types */
import { Application, Request, Response } from "express";


export default class FallbackRoute extends Route {

    constructor(app: Application) {
        super(app);

        this.routes = [
            { method: 'all', path: '**', handler: this.invalidAccess }
        ]
    }

    private invalidAccess(req: Request, res: Response): void {
        res.status(404).send('invalid request');
    }

}