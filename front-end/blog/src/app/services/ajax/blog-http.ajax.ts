/** Native Modules */
import { HttpClient } from '@angular/common/http';

/** Custom Modules */
import { DuplicationError } from 'src/app/helpers/error.helper';


export abstract class BlogHttp {

    protected abstract http: HttpClient;

    protected get<T>(uri: string): Promise<T> {
        return this.http.get<T>(uri).toPromise();
    }

    protected async post(uri: string, body: any): Promise<any> {
        const res = await this.http.post(uri, body).toPromise() as any;
        if (res.code === 11000) throw new DuplicationError(res.keyValue);

        return res;
    }

    protected async put(uri: string, body: any): Promise<any> {
        const res = await this.http.put(uri, body).toPromise() as any;
        if (res.code === 11000) throw new DuplicationError(res.keyValue);

        return res;
    }

    protected delete(uri: string): Promise<any> {
        return this.http.delete(uri).toPromise();
    }

    protected abstract baseURI(relativePath: string): string;

}