/** Core Modules */
import { Application, Request, Response } from "express";

/** Custom Modules */
import Route from "../route";


export default class RedirectRoute extends Route {

    constructor(app: Application) {
        super(app);

        this.routes = [
            { method: 'get', path: '/blog', handler: this.blogRedirect },
            { method: 'get', path: '/blog*', handler: this.blogRedirect }
        ]
    }

    private async blogRedirect(req: Request, res: Response): Promise<void> {
        res.redirect(`https://blog.eunsatio.io${ req.url.replace('/blog', '') }`);
    }

}