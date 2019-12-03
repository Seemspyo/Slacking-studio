import { Field } from "multer";


export type UploadField = string | Field[];
export type uploadType = 'single' | 'fields' | 'array';
export type MulterFile = Express.Multer.File;
export type UplaodResult = { [fieldname: string]: MulterFile[] } | MulterFile[] | MulterFile;

export interface WriteStreamOption {
    flags?: string;
    encoding?: string;
    fd?: number;
    mode?: number;
    autoClose?: boolean;
    start?: number;
    highWaterMark?: number;
}