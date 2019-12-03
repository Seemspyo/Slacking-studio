import express, { Application } from 'express';
import path from 'path';
import ejs from 'ejs';
import { ServeStaticOptions } from 'serve-static';


export default function virtualHost(id: string, viewStaticOption?: ServeStaticOptions): Application {
    const
    VIEW_ROOT = path.resolve(__dirname, `../host/${ id }/web`),
    DATA_ROOT = path.resolve(__dirname, `../host/${ id }/data`),
    vApp = express();

    vApp.set('view engine', 'html');
    vApp.set('views', VIEW_ROOT);
    vApp.engine('html', ejs.renderFile);

    vApp.use(express.static(VIEW_ROOT, viewStaticOption));
    vApp.use(express.static(DATA_ROOT));

    return vApp;
}