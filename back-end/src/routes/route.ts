import { Application } from "express"
import { RouteParam } from "./@types";


export default abstract class Route {

    protected routes: Array<RouteParam>;

    constructor(protected app: Application) {}

    public route(): void {
        for (const { method, path, handler } of this.routes) this.app[method](path, handler);
    }

}