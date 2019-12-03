import { createWriteStream, WriteStream } from 'fs';
import { WriteStreamOption } from './@types';


export class LogModule {

    private stream: WriteStream;

    constructor(path: string, option?: WriteStreamOption) {
        this.stream = createWriteStream(path, option);
    }

    public write(message: string): void {
        const log = `${ new Date().toLocaleString() }: ${ message }\n`;

        this.stream.write(log);
    }

}