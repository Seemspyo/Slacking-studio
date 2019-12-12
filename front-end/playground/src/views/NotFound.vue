<template>
    <div class="playground-notfound">
        <div class="playground-notfound-logo">
            <img src="@/assets/images/logo.png" />
        </div>
        <p class="playground-notfound-text">Path <strong class="playground-notfound-text-strong">{{ path }}</strong> not exist.</p>
    </div>
</template>

<style lang="scss" scoped>
    @import '@/variables';

    .playground-notfound {
        width: 100%; height: 100%;
        flex-grow: 1;
        background-color: rgba($MILD-GREEN, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        

        .playground-notfound-logo {
            width: 50px; height: 50px;

            img {
                max-width: 100%;
            }

        }

        p.playground-notfound-text {
            font: {
                size: 1.6rem;
                weight: 600;
            }
            margin: {
                top: $GLOBAL-PADDING;
                left: $GLOBAL-PADDING;
            }

            strong.playground-notfound-text-strong {
                color: $MILD-GREEN;
                font: {
                    size: 1.2em;
                    weight: 900;
                }
            }

        }

    }
</style>

<style lang="scss" scoped>
@import '@/variables';

@media only screen and (max-width: 320px) {

    .playground-notfound {
        padding: 0 $GLOBAL-PADDING;

        .playground-notfound-logo {
            display: none;
        }

        p.playground-notfound-text {
            margin: 0;
        }

    }

}
</style>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class NotFound extends Vue {

    public path = '';

    created() {
        const { pathname, search } = window.location;

        this.path = `${ pathname }${ search }`;
    }

}
</script>