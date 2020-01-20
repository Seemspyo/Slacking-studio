import { Response } from "express";
import { LogModule } from "./log.module";
import { MongoError } from "mongodb";


export abstract class AppError extends Error {

    public status: number;

    constructor(message?: string) {
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

}

export class AccessError extends AppError {

    constructor(message?: string) {
        super(message || 'access denied');

        this.status = 401;
    }

}

export class ForbiddenError extends AppError {

    constructor(message?: string) {
        super(message || 'access blocked');

        this.status = 403;
    }

}

export class NotFoundError extends AppError {

    constructor(message?: string) {
        super(message || 'not found');

        this.status = 404;
    }

}

export class ErrorHandler {

    private logger: LogModule = new LogModule('./log/route-error.log');

    public handle(error: Error, res: Response): void {
        if (error instanceof AppError) {
            const { status, message } = error;

            res.status(status).send(message);
        }
        else if (error instanceof MongoError) {
            res.status(200).json(error);
        }
        else {
            res.status(500).send('unknownError');
            this.logger.write(JSON.stringify(error));
        }
    }

}