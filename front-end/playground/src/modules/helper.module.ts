export default class Helper {

    static listen(el: any, type: string, listener: any): () => void {
        if ((window as any).EventTarget && el instanceof EventTarget || el.addEventListener) {
            el.addEventListener(type, listener);

            return () => el.removeEventListener(type, listener);
        }
    }

    static assignStyle(el: any, style: { [ key: string ]: string }): void {
        for (const key in style) {
            const value = style[key];

            if (value) el.style.setProperty(key, value);
            else el.style.removeProperty(key);
        }
    }

    static wait(duration: number): Promise<void> {
        return new Promise(resolve => window.setTimeout(resolve, duration));
    }

    static toQueryString(obj: object): string {
        let query: string = '';

        for (const key in obj) if (obj[key]) query = query.concat(`&${ key }=${ obj[key] }`);
        if (query) query = '?'.concat(query.replace('&', ''));

        return query;
    }

}