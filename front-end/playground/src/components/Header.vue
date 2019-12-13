<template>
    <header class="playground-header">

        <h1 class="playground-header-title"><a href="https://eunsatio.io" class="quicksand key-theme-item">Slacking studio</a>Playground</h1>
        <div class="playground-header-button" @pointerdown.stop>
            <Button theme="round" :centered="false" @click.stop="toggleTab()">
                <i class="playground-header-config-icon material-icons">palette</i>
            </Button>
        </div>

        <transition name="tab">
        <template v-if="tabVisibility">
            <div class="playground-header-tab" @click.stop  @pointerdown.stop>

                <div class="playground-header-tab-field">
                    <div class="field-label-container">
                        <h5 class="field-label">Background</h5>
                    </div>
                    <div class="field-item-container">
                        <div class="field-item" v-for="theme of backgroundThemes" :key="theme.id">
                            <Button theme="round" :centered="true" @click.stop="changeBackgroundColor(theme)">
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
                            <Button theme="round" :centered="true" @click.stop="changeKeyColor(theme)">
                                <div class="field-button" :class="{ selected: theme.selected }" :style="{ backgroundColor: theme.color }"></div>
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </template>
        </transition>

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

            a.key-theme-item {
                font-size: 0.6em;
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
            z-index: 3;

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

<style lang="scss" scoped>

    .tab-enter-active, .tab-leave-active {
        transition: {
            property: opacity, transform;
            duration: 500ms;
        }
    }

    .tab-enter {
        opacity: 0;
        transform: translateY(10%);

        &-to {
            opacity: 1;
            transform: translateY(0);
        }

    }

    .tab-leave-to {
        transform: translateY(10%);
        opacity: 0;
    }

</style>

<style lang="scss">
    @import '@/variables';

    .playground-header-button button.playground-button {
        width: 46px; height: 46px;

        i.playground-header-config-icon {
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

/** Custom Modules */
import Helper from '../modules/helper.module';
import CacheModule from '../modules/cache.module';


@Component({
    components: {
        Button
    }
})
export default class Header extends Vue {

    public tabVisibility: boolean = false;
    public backgroundThemes: Array<ThemeInfo> = Header.assignSelectedProperty(backgroundThemes);
    public keyThemes: Array<ThemeInfo> = Header.assignSelectedProperty(keyThemes);

    private removeGlobalEvent: () => void;

    @Prop(Boolean) animating?: boolean;

    private backgroundThemeCache = new CacheModule('background-theme');
    private keyThemeCache = new CacheModule('key-theme');

    created() {
        this.initTheme();
    }

    public toggleTab(value?: boolean): void {
        this.tabVisibility = typeof value !== 'boolean' ? !this.tabVisibility : value;

        this.afterTabToggle();
    }

    public changeBackgroundColor(theme: ThemeInfo): void {
        if (this.animating) return;

        const prevTheme = this.backgroundThemes.find(theme => theme.selected);
        if (prevTheme) {
            if (prevTheme === theme) return;
            prevTheme.selected = false;
        }

        theme.selected = true;
        this.$emit('themechange', { id: theme.id, color: theme.color, type: 'background-theme' });
        this.backgroundThemeCache.set(theme.id);
    }

    public changeKeyColor(theme: ThemeInfo): void {
        const prevTheme = this.keyThemes.find(theme => theme.selected);
        if (prevTheme) {
            if (prevTheme === theme) return;
            prevTheme.selected = false;
        }

        theme.selected = true;
        this.$emit('themechange', { id: theme.id, color: theme.color, type: 'key-theme' });
        this.keyThemeCache.set(theme.id);
    }

    private static assignSelectedProperty(themes: Array<ThemeInfo>): Array<ThemeInfo> {
        return themes.map(theme => ({ ...theme, selected: false }));
    }

    private afterTabToggle(): void {
        switch (this.tabVisibility) {
            case true:
                this.removeGlobalEvent = Helper.listen(window, 'click', () => {
                    this.toggleTab(false);
                    this.removeGlobalEvent = void(0);
                });
                break;
            case false:
                if (this.removeGlobalEvent) this.removeGlobalEvent = void(0);
                break;
        }
    }

    private initTheme(): void {
        const
        backgroundThemeId = this.backgroundThemeCache.get(),
        keyThemeId = this.keyThemeCache.get();

        this.changeBackgroundColor(backgroundThemeId && this.backgroundThemes.find(theme => theme.id === backgroundThemeId) || this.backgroundThemes[0]);
        this.changeKeyColor(keyThemeId && this.keyThemes.find(theme => theme.id === keyThemeId) || this.keyThemes[0]);
    }

}
</script>