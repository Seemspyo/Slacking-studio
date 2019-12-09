<template>
    <header class="playground-header">

        <h1 class="playground-header-title"><span class="quicksand">Slacking studio</span>Playground</h1>
        <div class="playground-header-button">
            <Button type="round" :centered="false" @click="toggleTab()">
                <i class="playground-header-config-icon material-icons">palette</i>
            </Button>
        </div>

        <template v-if="tabVisibility">
            <div class="playground-header-tab">

                <div class="playground-header-tab-field">
                    <div class="field-label-container">
                        <h5 class="field-label">Background</h5>
                    </div>
                    <div class="field-item-container">
                        <div class="field-item" v-for="theme of backgroundThemes" :key="theme.id">
                            <Button type="round" :centered="true" @click="changeBackgroundColor(theme)">
                                <div class="field-button" :class="{ selected: theme.selected }" :style="{ backgroundColor: theme.color }"></div>
                            </Button>
                        </div>
                    </div>
                </div>

                <div class="playground-header-tab-field">
                    <div class="field-label-container">
                        <h5 class="field-label">Key color</h5>
                    </div>
                    <div class="field-item-container">
                        <div class="field-item" v-for="theme of keyThemes" :key="theme.id">
                            <Button type="round" :centered="true" @click="changeKeyColor(theme)">
                                <div class="field-button" :class="{ selected: theme.selected }" :style="{ backgroundColor: theme.color }"></div>
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </template>

    </header>
</template>

<style lang="scss" scoped>
    @import '@/variables';

    header.playground-header {
        display: flex;
        align-items: center;
        width: 100%; height: 72px;
        position: relative;

        h1.playground-header-title {
            font-size: 1.6rem;
            margin-left: $GLOBAL-PADDING;
            color: #fff;
            text-align: center;
            letter-spacing: 0.1em;
            line-height: 100%;

            span {
                font-size: 0.6em;
                color: $MILD-GREEN;
                display: block;
                letter-spacing: 0.22em;
            }

        }

        .playground-header-button {
            margin: {
                left: auto;
                right: $GLOBAL-PADDING;
            }
        }

        .playground-header-tab {
            position: absolute;
            top: 100%; right: $GLOBAL-PADDING;
            width: 94%;
            max-width: 160px;
            padding: $GLOBAL-PADDING;
            background-color: #232323;
            box-shadow: 0 5px 5px rgba(#000, .2);

            .playground-header-tab-field {
                width: 100%;
                display: flex;
                flex-direction: column;

                &:not(:first-of-type) {
                    margin-top: $GLOBAL-PADDING;
                }

                .field-label-container {
                    border-bottom: groove 2px #ccc;
                    padding-bottom: 4px;

                    h5.field-label {
                        text-align: right;
                        color: #f7f7f7;
                        font-size: 0.8rem;
                    }

                }

                .field-item-container {
                    margin-top: $GLOBAL-PADDING / 2;
                    display: flex;
                    flex-wrap: wrap;

                    .field-item {
                        margin: 0 2px;
                        --ripple-background-color: #{ $RED-ORANGE };

                        .field-button {
                            width: 70%; height: 70%;
                            background-color: #000;
                            border-radius: 50%;
                            border: rgba(#ccc, .8) solid 2px;
                            transition: border-color 500ms;

                            &.selected {
                                border-color: rgba($RED-ORANGE, .8);
                            }

                        }

                    }

                }

            }

        }

    }
</style>

<style lang="scss">
    @import '@/variables';

    .playground-header-button button.playground-button {
        width: 46px; height: 46px;
        --ripple-background-color: #{ $MILD-GREEN; };

        i.playground-header-config-icon {
            color: lighten($MILD-GREEN, 10%);
            transition: color 300ms;
            font-size: 2rem;
        }

    }

</style>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

/** Components */
import Button from '@/components/Button.vue';

/** Types */
import { ThemeInfo } from './@types';

/** Datas */
import { backgroundThemes, keyThemes } from '../data/theme.data';


@Component({
    components: {
        Button
    }
})
export default class Header extends Vue {

    public tabVisibility: boolean = false;
    public backgroundThemes: Array<ThemeInfo> = Header.assignSelectedProperty(backgroundThemes);
    public keyThemes: Array<ThemeInfo> = Header.assignSelectedProperty(keyThemes);

    @Prop(Boolean) animating?: boolean;

    created() {
        this.changeBackgroundColor(this.backgroundThemes[0]);
        this.changeKeyColor(this.keyThemes[0]);
    }

    public toggleTab(): void {
        this.tabVisibility = !this.tabVisibility;
    }

    public changeBackgroundColor(theme: ThemeInfo): void {
        if (this.animating) return;

        const prevTheme = this.backgroundThemes.find(theme => theme.selected);
        if (prevTheme) {
            if (prevTheme === theme) return;
            prevTheme.selected = false;
        }

        theme.selected = true;
        this.$emit('theme', { id: theme.id, color: theme.color, type: 'background-color' });
    }

    public changeKeyColor(theme: ThemeInfo): void {
        const prevTheme = this.keyThemes.find(theme => theme.selected);
        if (prevTheme) {
            if (prevTheme === theme) return;
            prevTheme.selected = false;
        }

        theme.selected = true;
        this.$emit('theme', { color: theme.color, type: 'key-color' });
    }

    private static assignSelectedProperty(themes: Array<ThemeInfo>): Array<ThemeInfo> {
        return themes.map(theme => ({ ...theme, selected: false }));
    }

}
</script>