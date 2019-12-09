<template>
  <main class="playground-main" :style="getBackgroundColor()" :id="getId()">
    <div class="playground-main-animation-container">
      <transition name="ripple">
        <div class="playground-main-animation" v-if="animated" :style="getBackgroundColor()"></div>
      </transition>
    </div>
    <div class="playground-main-content">
      <Header @theme="changeTheme($event)" :animating="animated"></Header>
      <List></List>
    </div>
  </main>
</template>

<style lang="scss" scoped>
  @import '@/variables';

  main.playground-main {
    width: 100%; height: 100%;
    display: block;
    background-color: $BACKGROUND-COLOR;
    flex-grow: 1;
    transition: {
      property: background-color;
      duration: 400ms;
      delay: 500ms;
    }

    .playground-main-content {
      display: block;
      width: 100%; min-height: 100%;
      position: relative;
      z-index: 1;
    }

  }

  .playground-main-animation-container {
    z-index: 0;
    overflow: hidden;
    position: fixed;
    top: 0; right: 0; bottom: 0; left: 0;

    .playground-main-animation {
      $SIZE: 300vw;
      position: absolute;
      top: -$SIZE / 2; right: -$SIZE / 2;
      border-radius: 50%;
      width: $SIZE; height: $SIZE;
      transform-origin: center center;
    }

  }

  .ripple-enter-active {
    transition: {
      property: transform;
      duration: 1000ms;
      timing-function: cubic-bezier(.42,.52,.51,.69);
    }
  }

  .ripple-enter {
    transform: scale(0);

    &-to {
      transform: scale(1.2);
    }

  }

  .ripple-leave-active {
    transition: opacity 500ms;
    transform: translate(50%, -50%);
  }

  .ripple-leave {

    &-to {
      opacity: 0;
    }

  }

</style>

<script lang="ts">
import Vue from "vue";
import { Component } from 'vue-property-decorator';

/** Components */
import Header from '@/components/Header.vue';
import List from "@/components/List.vue";

/** Types */
import { ThemeInfo } from '../components/@types';

/** Custom Modules */
import Helper from "../modules/helper";


@Component({
  components: {
    Header,
    List
  }
})
export default class Main extends Vue {

  public backgroundTheme?: ThemeInfo;

  public animated: boolean = false;

  public async changeTheme(theme: ThemeInfo): Promise<void> {
    switch (theme.type) {
      case 'background-color':
        const notFirst = Boolean(this.backgroundTheme);
        this.backgroundTheme = theme;

        if (notFirst) {
          this.animated = true;
          await Helper.wait(1000);
          this.animated = false;
        }
        break;
      case 'key-color':
        break;
    }
  }

  public getBackgroundColor(): { backgroundColor?: string } {
    return { backgroundColor: this.backgroundTheme && this.backgroundTheme.color }
  }

  public getId(): string {
    return this.backgroundTheme && this.backgroundTheme.id || 'no-theme';
  }

}
</script>
