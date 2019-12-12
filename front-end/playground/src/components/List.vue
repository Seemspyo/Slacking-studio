<template>
    <div class="playground-gallery">

        <form class="playground-gallery-form" @submit.prevent="search()">
            <input class="playground-gallery-form-input key-theme-item" type="text" v-model="searchValue" placeholder="Search..." @input="search()" />
            <span class="playground-gallery-form-border"></span>
        </form>

        <div class="playground-gallery-list">
            <div class="playground-gallery-item" v-for="item in list" :key="item.id">

                <a :href="item.uri" target="_blank" class="item-container">
                    <div class="item-thumbnail-image" :style="{ backgroundImage: `url(${ item.thumbnailImagePath })` }"></div>

                    <div class="item-content">
                        <h2 class="item-content-title">{{ item.title.ko }}</h2>
                        <h3 class="item-content-title key-theme-item quicksand">{{ item.title.en }}</h3>
                        <h4 class="item-content-info quicksand">{{ item.author || 'Anonymous' }} · {{ item.createdAt | dateString }}</h4>
                        <p class="item-content-description n-gothic">{{ item.description }}</p>
                    </div>
                </a>

            </div>
            <div class="playground-gallery-noitem" v-if="!list.length">
                <p class="playground-gallery-noitem-text">no Item :(</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '@/variables';

    .playground-gallery {
        width: 100%;
        max-width: 1040px;
        margin: 20px auto 0;

        form.playground-gallery-form {
            width: 98%;
            margin: 20px auto 0;
            position: relative;

            input.playground-gallery-form-input {
                width: 100%; height: 62px;
                background-color: transparent;
                border-bottom: solid 3px #000;
                font: {
                    size: 2rem;
                    weight: 600;
                }
                transition: border-bottom-color 300ms;

                &::placeholder {
                    color: #000;
                    transition: color 300ms;
                }

                &:focus {

                    & + span.playground-gallery-form-border {
                        transform: scaleX(1);
                        opacity: 1;
                    }

                }

            }

            span.playground-gallery-form-border {
                position: absolute;
                right: 0; bottom: 0; left: 0;
                width: 100%; height: 3px;
                background-color: #fff;
                transform: scaleX(0.05);
                transform-origin: left center;
                opacity: 0;
                transition: transform 500ms, opacity 300ms;
            }

        }

        .playground-gallery-list {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            margin: 20px auto 0;

            .playground-gallery-item {
                width: 48%;
                margin: 20px 1% 0;
                box-shadow: 10px 10px 3px 0 rgba(#000,.2);
                transition: box-shadow 300ms;

                &:hover {
                    box-shadow: 15px 15px 3px 0 rgba(#000,.4);
                }

            }

            .playground-gallery-noitem {
                width: 100%; height: 300px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 40px;

                p.playground-gallery-noitem-text {
                    font: {
                        size: 3rem;
                        weight: 600;
                    }
                }

            }

        }

    }

    a.item-container {
        display: block;
        width: 100%;

        .item-thumbnail-image {
            width: 100%; height: 260px;
            background: {
                size: cover;
                position: center center;
                repeat: no-repeat;
            }
        }

        .item-content {
            width: 100%;
            padding: $GLOBAL-PADDING;
            font-size: 1rem;

            .item-content-title {
                max-width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            h2.item-content-title {
                font-size: 1.6em;
                letter-spacing: 0.1em;
            }

            h3.item-content-title {
                font-size: 1em;
            }

            h4.item-content-info {
                font: {
                    size: 0.76em;
                    weight: 300;
                }
                margin-top: 4px;
            }

            p.item-content-description {
                margin-top: $GLOBAL-PADDING;
                font: {
                    size: 0.9em;
                    weight: 300;
                }
                white-space: nowrap;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }

        }

    }

</style>

<style lang="scss" scoped>
@media only screen and (max-width: 1070px) {

    .playground-gallery {
        width: 98%;
    }

    a.item-container {

        .item-thumbnail-image {
            height: 24.3vw;
        }

        .item-content {
            font-size: 1.5vw;
        }

    }

}
</style>

<style lang="scss" scoped>
@media only screen and (max-width: 760px) {

    .playground-gallery {
        
        .playground-gallery-list {

            .playground-gallery-item {
                width: 100%;
            }

        }

    }

    a.item-container {

        .item-thumbnail-image {
            height: 50vw;
        }

        .item-content {
            font-size: 3.2vw;
        }

    }

}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';

/** Types */
import { GalleryItem } from './@types';

/** Custom Modules */
import moment from 'moment';
import ItemModule from '../modules/item.module';


@Component({
    filters: {
        dateString(value: Date): string {
            if (value && !(value instanceof Date)) value = new Date(value);

            return moment(value).fromNow();
        }
    }
})
export default class List extends Vue {

    public list: Array<GalleryItem> = []
    private rawList: Array<GalleryItem> = [
        {
            thumbnailImagePath: 'https://www.pixijs.com/wp/wp-content/uploads/gg-540x312.jpg',
            title: {
                ko: '테스트 글이다아아아아',
                en: 'What a TEEEEEEEEEST'
            },
            uri: 'https://google.com',
            description: '테스트 프로젝트여\n앙',
            author: 'SeemsPyo',
            createdAt: new Date('2019-12-10'),
            status: true,
            tags: ['Test', 'Project', 'Anarchy']
        }
    ]

    public searchValue: string = '';

    private itemModule: ItemModule = new ItemModule();

    created() {
        this.loadList();
    }

    public search(): void {
        const keyword = this.searchValue.toLowerCase();

        this.list = this.rawList.filter(item => 
            item.title.ko.toLowerCase().includes(keyword)
            || item.title.en.toLowerCase().includes(keyword)
            || item.tags.find(tag => tag.toLowerCase().includes(keyword))
        );
    }

    private async loadList(): Promise<void> {
        try {
            this.rawList = this.rawList.concat(await this.itemModule.getItemAll({ status: true }));
            this.list = this.rawList;
        } catch (error) {
            console.log(error);
        }
    }

}
</script>