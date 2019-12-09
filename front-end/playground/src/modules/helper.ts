export default class Helper {

    static listen(el: any, type: string, listener: any): () => void {
        el.addEventListener(type, listener);

        return () => el.removeEventListener(type, listener);
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

}