/** Custom Modules */
import Route from "../route";
import { AuthModule } from "../../modules/auth.module";
import { CipherModule } from "../../modules/cipher.module";
import { ErrorHandler } from "../../modules/error.module";

/** Types */
import { Application } from "express";


export abstract class BlogRoute extends Route {

    public static authModule: AuthModule;
    public static cipherModule: CipherModule;

    protected auth: AuthModule;
    protected cipher: CipherModule;
    protected errorHandler = new ErrorHandler();

    constructor(app: Application) {
        super(app);

        this.auth = BlogRoute.authModule;
        this.cipher = BlogRoute.cipherModule;

        for (const module of [ this.auth, this.cipher ]) if (!module === void(0)) throw new RangeError('required module not assigned');
    }

    public static setModules(modules: { authModule: AuthModule, cipherModule: CipherModule }): void {
        Object.assign(BlogRoute, modules);
    }

    protected toUpdateForm(source: any): any {
        const target = new Object() as any;

        this._toUpdateForm(target, source);

        return target;
    }

    private _toUpdateForm(target: any, source: any, key?: string): any {
        if (typeof source === 'object' && !Array.isArray(source)) {
            for (const nestedKey in source) this._toUpdateForm(target, source[nestedKey], `${ key ? key + '.' : '' }${ nestedKey }`);
            return;
        }
    
        if (key) target[key] = source;
    }

}