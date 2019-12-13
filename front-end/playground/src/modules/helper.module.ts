import { AssignOption } from './@types';


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

    static toFormData(obj: { [key: string]: any }, fileFieldName: string = 'file'): FormData {
        const
        data = new FormData(),
        toFormData = (value: any, key: string) => {
            if (value instanceof File) return data.append(fileFieldName, value, value.name);
            if (typeof value !== 'object') return data.append(key, value);

            if (Array.isArray(value)) for (const [index, item] of value.entries()) toFormData(item, `${ key }[${ index }]`);
            else for (const nestedKey in value) toFormData(value[nestedKey], `${ key }[${ nestedKey }]`);
        }

        for (const key in obj) toFormData(obj[key], key);

        return data;
    }

    static assign(target: any, source: any, option: AssignOption = {}): any {
        const
        { key, override, deep } = option,
        keyDefined = key !== void(0);

        if (
            keyDefined &&
            (!source || typeof source !== 'object' || (!deep && source.prototype !== Object.prototype))
        ) {
            target[key] = !override && target[key] !== void(0) ? target[key] : source;
        } else {
            let
            emptyData: object = void(0),
            copyFunc: Function = void(0);

            switch (Array.isArray(source)) {
                case true:
                    emptyData = new Array();

                    copyFunc = () => source.forEach(
                        (item: any, index: number) => this.assign(target, item, { key: index, override, deep })
                    );
                    break;
                case false:
                    emptyData = new Object();
                    if (deep && Object.getPrototypeOf(source) !== Object.prototype) Object.setPrototypeOf(emptyData, source);
    
                    copyFunc = () => {
                        for (const nestedKey in source) this.assign(target, source[nestedKey], { key: nestedKey, override, deep });
                    }
                    break;
            }
    
            if (keyDefined) {
                if (!target[key]) target[key] = emptyData;
                target = target[key];
            }
    
            copyFunc();
        }

        return target;
    }

}