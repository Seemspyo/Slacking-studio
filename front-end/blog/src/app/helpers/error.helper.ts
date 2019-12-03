/**
 * @code 4000: App initializing Error
 * @code 5003: DB duplication Error
 */

export abstract class AppError extends Error {

    public abstract code: number;

    constructor(message?: string) {
        super(message);

        this.name = this.constructor.name;
    }

}

export class AppInitializingError extends AppError {

    public code = 4000;

    constructor() {
        super('Fail to initializing app. Please try later.');
    }

}

export class UserNotVerifiedError extends AppError {

    public code = 4201;
    public data: { email: string; nickname: string; }

    constructor(email: string, nickname: string) {
        super(`Your ownership for ${ email } hasn't verified yet`);

        this.data = { email, nickname }
    }

}

export class UserBlockedError extends AppError {

    public code = 4203;

    constructor() {
        super('This account is blocked. Please contact site manager');
    }

}

export abstract class DatabaseError extends Error {

    public abstract code: number;

    constructor(message?: string) {
        super(message);

        this.name = this.constructor.name;
    }

}

export class DuplicationError extends DatabaseError {

    public code = 5003;

    constructor(keys: { [key: string]: any }) {
        super(`Unique field "${ typeof keys === 'object' ? Object.keys(keys).join(', ') : keys }" is duplicated.`);
    }

}

export const unknownErrorContext = 'Unknown error occurred.';
export const getHttpErrorContext = (status: number): string => `${ status }: Connection error occurred.`;