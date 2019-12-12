export default class CacheModule {

    private storage: Storage;

    constructor(
        private id: string,
        type: 'local' | 'session' = 'local'
    ) {
        this.storage = type === 'local' ? window.localStorage : window.sessionStorage;
    }

    public set(data: any): string {
        if (typeof data !== 'string') JSON.stringify(data);

        this.storage.setItem(this.id, data);

        return data;
    }

    public get(): any {
        let data = this.storage.getItem(this.id);

        try {
            data = JSON.parse(data);
        } catch (error) {
            if (error instanceof SyntaxError) return data;
            else throw error;
        }

        return data;
    }

    public clear(): void {
        this.storage.removeItem(this.id);
    }

}