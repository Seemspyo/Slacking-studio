<template>
    <div class="playground-gallery">
        <div class="playground-gallery-list">
            <div class="playground-gallery-item" v-for="item in list" :key="item.id">

                <a :href="item.uri" target="_blank" class="item-container">
                    <div class="item-thumbnail-image" :style="{ backgroundImage: `url(${ item.thumbnailImagePath })` }"></div>

                    <div class="item-content">
                        <h2 class="item-content-title">{{ item.title.ko }}</h2>
                        <h3 class="item-content-title quicksand">{{ item.title.en }}</h3>
                        <h4 class="item-content-info quicksand">{{ item.author || 'Anonymous' }} · {{ item.createdAt | dateString }}</h4>
                        <p class="item-content-description n-gothic">{{ item.description }}</p>
                    </div>
                </a>

            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '@/variables';

    .playground-gallery {
        margin-top: 60px;
        width: 100%;

        .playground-gallery-list {
            width: 90%;
            max-width: 1040px;
            display: flex;
            flex-wrap: wrap;
            margin: 0 auto;

            .playground-gallery-item {
                width: 48%;
                margin: 20px 1% 0;
                box-shadow: 10px 10px 0 0 rgba(0,0,0,.4);
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

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';

/** Types */
import { GalleryItem } from './@types';

/** Custom Modules */
import moment from 'moment';


@Component({
    filters: {
        dateString(value: Date): string {
            if (value && !(value instanceof Date)) value = new Date(value);

            return moment(value).fromNow();
        }
    }
})
export default class List extends Vue {

    public list: Array<GalleryItem> = [
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
            status: true
        },
        {
            thumbnailImagePath: 'https://www.pixijs.com/wp/wp-content/uploads/gg-540x312.jpg',
            title: {
                ko: '리스키 JS',
                en: 'What a TEEEEEEEEEST'
            },
            uri: 'https://google.com',
            description: '테스트 프로젝트여',
            author: 'SeemsPyo',
            createdAt: new Date('2019-12-10'),
            status: true
        },
        {
            thumbnailImagePath: 'https://www.pixijs.com/wp/wp-content/uploads/gg-540x312.jpg',
            title: {
                ko: '프로젝트 아나키',
                en: 'What a TEEEEEEEEEST'
            },
            uri: 'https://google.com',
            description: '테스트 프로젝트여',
            author: 'SeemsPyo',
            createdAt: new Date('2019-12-10'),
            status: true
        },
        {
            thumbnailImagePath: 'https://www.pixijs.com/wp/wp-content/uploads/gg-540x312.jpg',
            title: {
                ko: '테스트 글이다아아아아',
                en: 'What a TEEEEEEEEEST'
            },
            uri: 'https://google.com',
            description: '테스트 프로젝트여',
            author: 'SeemsPyo',
            createdAt: new Date('2019-12-10'),
            status: true
        },
        {
            thumbnailImagePath: 'https://www.pixijs.com/wp/wp-content/uploads/gg-540x312.jpg',
            title: {
                ko: '테스트 글이다아아아아',
                en: 'What a TEEEEEEEEEST'
            },
            uri: 'https://google.com',
            description: '테스트 프로젝트여',
            author: 'SeemsPyo',
            createdAt: new Date('2019-12-10'),
            status: true
        },
        {
            thumbnailImagePath: 'https://www.pixijs.com/wp/wp-content/uploads/gg-540x312.jpg',
            title: {
                ko: '테스트 글이다아아아아',
                en: 'What a TEEEEEEEEEST'
            },
            uri: 'https://google.com',
            description: '테스트 프로젝트여',
            author: 'SeemsPyo',
            createdAt: new Date('2019-12-10'),
            status: true
        }
    ]

}
</script>