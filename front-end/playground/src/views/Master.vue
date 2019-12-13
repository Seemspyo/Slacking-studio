<template>
    <div class="playground-master quicksand">

        <div class="playground-master-table-container">
        <md-table v-model="list" md-sort="createdAt" md-sort-order="desc" md-card md-fixed-header @md-selected="onSelect">

            <md-table-toolbar>
                <h2 class="md-title">Projects</h2>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
                <md-table-cell md-label="Title(Ko)" md-sort-by="title.ko">{{ item.title.ko }}</md-table-cell>
                <md-table-cell md-label="Title(En)" md-sort-by="title.en">{{ item.title.en }}</md-table-cell>
                <md-table-cell md-label="Project URI" md-sort-by="uri">{{ item.uri }}</md-table-cell>
                <md-table-cell md-label="Author" md-sort-by="author">{{ item.author }}</md-table-cell>
                <md-table-cell md-label="Created" md-sort-by="createdAt">{{ item.createdAt | dateString }}</md-table-cell>
                <md-table-cell md-label="Status" md-sort-by="status">{{ item.status | status }}</md-table-cell>
            </md-table-row>

        </md-table>
        </div>

        <div class="playground-master-button-container">
            <md-button class="md-raised md-dense md-icon-button md-primary" @click="addItem">
                <md-icon>add</md-icon>
            </md-button>
            <md-button class="md-raised md-dense md-icon-button md-primary" @click="editItem">
                <md-icon>edit</md-icon>
            </md-button>
            <md-button class="md-raised md-dense md-icon-button md-accent" @click="deleteItem">
                <md-icon>delete_forever</md-icon>
            </md-button>
        </div>

        <md-card class="playground-master-form-container">
            <form class="playground-master-form" @submit.prevent="submit">

                <md-switch class="playground-master-form-switch" v-model="form.status">Public</md-switch>

                <md-field>
                    <label>Thumbnail image</label>
                    <md-file v-model="form.thumbnailImage.name" accept="image/*" @change="onThumbnailSelect" />
                </md-field>

                <md-field>
                    <label>Title(Ko)</label>
                    <md-input v-model="form.title.ko" />
                </md-field>

                <md-field>
                    <label>Title(En)</label>
                    <md-input v-model="form.title.en" />
                </md-field>

                <md-field>
                    <label>Author</label>
                    <md-input v-model="form.author" />
                </md-field>

                <md-field>
                    <label>URI</label>
                    <md-input v-model="form.uri" />
                </md-field>

                <md-field>
                    <label>Description</label>
                    <md-textarea v-model="form.description"></md-textarea>
                </md-field>

                <md-button class="playground-master-form-submit md-raised md-primary" type="submit">Submit</md-button>

            </form>
        </md-card>

    </div>
</template>

<style lang="scss" scoped>
@import '@/variables';

.playground-master {
    width: 100%;
    min-height: 100%;
    flex-grow: 1;
    padding: $GLOBAL-PADDING;
    background-color: $MILD-GREEN;

    & &-table-container {
        max-height: 400px;
    }

    & &-button-container {
        margin-top: $GLOBAL-PADDING;
        display: flex;
        justify-content: flex-end;
    }

    & &-form-container {
        margin-top: $GLOBAL-PADDING;
        width: 100%;
        max-width: 600px;
        margin: $GLOBAL-PADDING auto;
    }

}

form.playground-master-form {
    padding: 12px 24px;
    display: flex;
    flex-direction: column;

    .playground-master-form-switch {
        margin: 12px 0 0 auto;
    }

}

</style>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

/** Types */
import { GalleryItem } from '../components/@types';

/** Custom Modules */
import moment from 'moment';
import Helper from '../modules/helper.module';
import ItemModule from '../modules/item.module';


Vue.use(VueMaterial);

const EMPTY_FORM: string = JSON.stringify({
    thumbnailImage: {
        file: null,
        name: '',
        path: ''
    },
    title: {
        ko: '',
        en: ''
    },
    author: '',
    uri: '',
    description: '',
    status: false
});

@Component({
    filters: {
        dateString: (value: Date) => {
            if (value && !(value instanceof Date)) value = new Date(value);

            return moment(value).format('llll');
        },
        status: (value: boolean) => value ? 'Public' : 'Private'
    }
})
export default class Master extends Vue {

    public list: Array<GalleryItem> = []
    public form: GalleryItem = Helper.assign({}, JSON.parse(EMPTY_FORM));

    private selected: GalleryItem;
    private editTargetId: string;

    private item: ItemModule = new ItemModule();

    created() {
        this.loadList();
    }

    public onSelect(item: GalleryItem): void {
        this.selected = item;
    }

    public onThumbnailSelect(event: Event): void {
        const inputEl = event.target as HTMLInputElement;

        if (inputEl.files) this.form.thumbnailImage.file = inputEl.files[0];
    }

    public addItem(): void {
        this.editTargetId = void(0);
        this.clearForm();
    }

    public editItem(): void {
        if (this.selected) {
            this.editTargetId = this.selected._id;

            Helper.assign(this.form, JSON.parse(JSON.stringify(this.selected)), { override: true });
        } else alert('no item selected.');
    }

    public async deleteItem(): Promise<void> {
        if (this.selected && confirm('Sure?')) {

            try {
                await this.item.deleteItem(this.selected._id);
                this.selected =
                this.editTargetId = void(0);
                this.clearForm();

                await this.loadList();
            } catch (error) {
                alert('An Error occurred.');
            }

        } else alert('no item selected.');
    }

    public async submit(): Promise<void> {
        const formData = Helper.toFormData(this.form, 'thumbnailImage');

        try {
            switch (Boolean(this.editTargetId)) {
                case true:
                    await this.item.updateItem(this.editTargetId, formData);
                    break;
                case false:
                    await this.item.createItem(formData);
                    break;
            }

            this.selected =
            this.editTargetId = void(0);
            this.clearForm();

            await this.loadList();

            alert('Success.');
        } catch (error) {
            alert('An Error occurred.');
        }
    }

    private async loadList(): Promise<void> {
        try {
            this.list = await this.item.getItemAll();
        } catch (error) {
            alert('An Error occurred while fetching item list.');
        }
    }

    private clearForm(): void {
        Helper.assign(this.form, JSON.parse(EMPTY_FORM), { override: true });
    }

}
</script>