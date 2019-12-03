import { AssignOption } from './@types';


export class UtilHelper {

    static EMPTY(): any {
        return void(0);
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

    static confine(n: number, max: number, min: number): number {
        return Math.max(min, Math.min(max, n));
    }

}