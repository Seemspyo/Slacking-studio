import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';


export default abstract class HttpModule {

    private static headers: AxiosRequestConfig['headers'] = {}

    public static setHeader(key: string, value: string): void {
        this.headers[key] = value;
    }

    public static deleteHeader(key: string): void {
        delete this.headers[key];
    }

    private http: AxiosInstance;

    constructor(baseURL?: string) {
        this.http = axios.create({ baseURL });
        this.http.interceptors.request.use(this.attachHeaders);
    }

    protected async get<T>(uri: string): Promise<T> {
        const res = await this.http.get(uri);

        return res.data;
    }

    protected async post<T>(uri: string, body: any): Promise<T> {
        const res = await this.http.post(uri, body);

        return res.data;
    }

    protected async put<T>(uri: string, body: any): Promise<T> {
        const res = await this.http.put(uri, body);

        return res.data;
    }

    protected async delete<T>(uri: string): Promise<T> {
        const res = await this.http.delete(uri);

        return res.data;
    }

    private attachHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
        config.headers = { ...config.headers, ...HttpModule.headers }

        return config;
    }

}