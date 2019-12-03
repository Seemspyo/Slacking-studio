/** Core Modules */
import { Application, Request, Response } from "express";

/** Custom Modules */
import Route from "../route";
import { AuthModule } from "../../modules/auth.module";


export default class AppRoute extends Route {

    private readonly auth: AuthModule;

    private assignToken: boolean = true;

    constructor(app: Application, auth: AuthModule, options?: { assignToken: boolean }) {
        super(app);

        this.auth = auth;
        this.routes = [
            { method: 'get', path: '**', handler: this.fallback.bind(this) }
        ]
        if (options && options.assignToken !== void(0)) this.assignToken = options.assignToken;
    }

    private fallback(req: Request, res: Response): void {
        const data = this.assignToken ? { appToken: this.auth.sign({ secret: `${ req.ip }|${ req.hostname }` }) } : null;

        res.render('index', data);
    }

}