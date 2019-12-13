/** Custom Modules */
import HttpModule from './http.module';
import Helper from './helper.module';

/** Variables */
import { WAS_HOST } from './@variables';

/** Types */
import { GalleryItem } from '@/components/@types';
import { HttpResultResponse, ItemOption } from './@types';


export default class ItemModule extends HttpModule {

    constructor() {
        super(WAS_HOST);
    }

    public getItemAll(options?: ItemOption): Promise<GalleryItem[]> {
        return this.get(`items${ options && Helper.toQueryString(options) || '' }`);
    }

    public createItem(item: FormData): Promise<HttpResultResponse> {
        return this.post('/item', item);
    }

    public updateItem(id: string, item: FormData): Promise<HttpResultResponse> {
        return this.put(`/item/${ id }`, item);
    }

    public deleteItem(id: string): Promise<HttpResultResponse> {
        return this.delete(`/item/${ id }`);
    }

}