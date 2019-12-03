import prerender from 'prerender-node';
import { PRERENDER_IO_TOKEN } from '../privates/app.private';


export default class PrenrederModule {

    private app: any;

    constructor(app: any) {
        this.app = app;
    }

    public enable(): void {
        prerender.set('prerenderToken', PRERENDER_IO_TOKEN);
        prerender.crawlerUserAgents = [ 'yeti', 'daum', 'daumoa', 'duckduckbot', 'nateon', ...prerender.crawlerUserAgents ]
        this.app.use(prerender);
    }

}