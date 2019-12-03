/** Core Modules */
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import multer from 'multer';
import { RequestHandler, Request } from 'express';
import { resolve } from 'path';

/** Types */
import { UploadField, uploadType, UplaodResult } from './@types';


export class UploadModule {

    private uploader: RequestHandler;
    private uploadType: uploadType;

    public dataRoot: string;

    constructor(path: string, fields: UploadField, dataRoot: string, flag?: string) {
        this.dataRoot = resolve(__dirname, dataRoot);
        this.uploadType = this.getUploadType(fields);
        this.uploader = this.getUploader(path, fields, flag);
    }

    public upload(req: Request): Promise<UplaodResult> {
        return new Promise((resolve, reject) => this.uploader(req, null, error => {
            if (!error) resolve(this.isMultiple ? req.files : req.file);
            else reject(error);
        }));
    }

    public removeFile(path: string): boolean {
        return removeFile(path);
    }

    public toRelativePath(path: string): string {
        return path.replace(this.dataRoot, '');
    }

    public toAbsolutePath(path: string): string {
        return this.dataRoot.concat(path);
    }

    private getUploader(path: string, fields: UploadField, flag?: string): RequestHandler {
        path = this.toAbsolutePath(path);
        if (flag) flag = `${ flag }.`;

        if (!existsSync(path)) mkdirSync(path, { recursive: true });

        const storage = multer.diskStorage({
            destination: (req, file, next) => next(void(0), path),
            filename: (req, file, next) => {
                const extension = file.originalname.split('.').pop();

                next(null, `${ flag }${ Date.now().toString(16) }.${ extension }`);
            }
        });

        return multer({ storage })[this.uploadType](fields as any);
    }

    private getUploadType(field: UploadField): uploadType {
        if (typeof field === 'string') return 'single';
        if (Array.isArray(field)) {
            if (field.every(value => typeof value === 'string')) return 'array';
            if (field.every(value => Boolean(value.name))) return 'fields';
        }

        throw new TypeError('fields are malformed');
    }

    private get isMultiple(): boolean {
        return [ 'array', 'fields' ].includes(this.uploadType);
    }

}

export function removeFile(path: string): boolean {
    if (existsSync(path)) {
        unlinkSync(path);

        return true;
    }

    return false;
}