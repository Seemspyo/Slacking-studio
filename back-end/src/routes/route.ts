import { Application } from "express"
import { RouteParam } from "./@types";


export default abstract class Route {

    protected app: Application;
    protected routes: Array<RouteParam>;

    constructor(app: Application) {
        this.app = app;
    }

    public route(): void {
        for (const { method, path, handler } of this.routes) this.app[method](path, handler);
    }

}