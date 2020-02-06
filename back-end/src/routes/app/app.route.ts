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
            { method: 'get', path: '*', handler: this.render.bind(this) }
        ]
        if (options && options.assignToken !== void(0)) this.assignToken = options.assignToken;
    }

    private render(req: Request, res: Response): void {
        const data = this.assignToken ? { appToken: this.auth.sign({ secret: `${ req.ip }|${ req.hostname }` }) } : null;

        let url = req.url;
        if (url.charAt(0) === '/') url = url.replace('/', '');

        if (!url.length || url.charAt(url.length - 1) === '/') res.render(`${ url }index`, { cache: false, ...data }, (error, html) => {
            if (!error) res.send(html);
            else res.status(404).render('index', { cache: false, ...data });
        });
        else res.render('index', { cache: false, ...data });
    }

}