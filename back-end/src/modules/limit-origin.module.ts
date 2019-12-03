export const limit = (whitelist: Array<string>): ((origin: string, next: any) => void) => {
    return (origin, next) => {
        if (whitelist.includes(origin)) next(null, true);
        else next();
    }
}