<template>
  <main class="playground-main" :background-theme="getBackgroundThemeId()" :key-theme="getKeyThemeId()">

    <div class="playground-main-animation-container">
      <transition name="ripple">
        <div class="playground-main-animation" v-if="animated" :style="getBackgroundColor()" ref="animationEl"></div>
      </transition>
    </div>

    <div class="playground-main-background-container">
      <canvas class="playground-main-background" ref="background"></canvas>
    </div>

    <div class="playground-main-content">
      <Header @themechange="changeTheme($event)" :animating="animated"></Header>
      <List></List>
      <div class="playground-main-footer-container">
        <Footer></Footer>
      </div>
    </div>

  </main>
</template>

<style lang="scss" scoped>
  @import '@/variables';

  main.playground-main {
    width: 100%; height: 100%;
    min-height: 100vh;
    display: flex;
    flex-grow: 1;
    transition: {
      property: background-color;
      duration: 400ms;
      delay: 500ms;
    }

    .playground-main-content {
      display: flex;
      flex-direction: column;
      width: 100%; min-height: 100%;
      position: relative;
      z-index: 2;
      flex-grow: 1;

      .playground-main-footer-container {
        margin-top: auto;
      }

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

  .playground-main-background-container {
    z-index: 1;
    overflow: hidden;
    position: fixed;
    top: 0; right: 0; bottom: 0; left: 0;

    canvas.playground-main-background {
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      width: 100%; height: 100%;
    }

  }

  .ripple-enter-active {
    transition: {
      property: transform;
      duration: 1000ms;
      timing-function: $RIPPLE-TIMING-FUNCTION;
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

<style lang="scss">
  @import '@/variables';

  $background-themes: (
    "shy-black": #333,
    "absolute-white": #fff
  );
  $key-themes: (
    "mild-green": $MILD-GREEN,
    "lime": #c2db1d,
    "banana-yellow": #f0d524,
    "crimson": #EB4034,
    "hotpink": #FF69B4,
    "rose-pink": #FC3D66,
    "ocean-blue": #1d8fdb,
    "wood-mint": #18c9c4,
    "indigo": #4b0082
  );

  @mixin HeaderStyle($color) {
    header.playground-header h1.playground-header-title {
      color: $color;
      transition: color 500ms linear 500ms;
    }
  }

  main.playground-main {

    .key-theme-item {
      transition: color 300ms;
    }

    @each $name, $color in $background-themes {
      $text-color: if(lightness($color) > lightness(#888), #333, #fff);

      &[background-theme=#{ $name }] {
        background-color: $color;

        header.playground-header h1.playground-header-title {
          color: $text-color;
          transition: color 500ms linear 500ms;
        }

        a.item-container .item-content {
          background-color: if(lightness($color) > lightness(#888), darken($color, 10%), lighten($color, 5%));
          transition: background-color 500ms;

          h2.item-content-title {
            color: $text-color;
            transition: color 500ms;
          }

          h4.item-content-info, p.item-content-description {
            color: darken($text-color, 10%);
          }

        }

        .playground-gallery form.playground-gallery-form input.playground-gallery-form-input {
          border-bottom-color: invert($text-color);

          &::placeholder {
            color: invert($text-color);
          }

        }

        p.playground-gallery-noitem-text {
          color: invert($text-color);
        }

        footer.playground-footer p.playground-footer-copyright {
          color: $text-color;
          transition: color 500ms;
        }

      }
    }

    @each $name, $color in $key-themes {
      &[key-theme=#{ $name }] {

        header.playground-header h1.playground-header-title a {
          color: $color;
        }

        .playground-header-button button.playground-button {
          --ripple-background-color: #{ $color };

          i.playground-header-config-icon {
            color: $color;
          }

        }

        a.item-container .item-content h3.item-content-title {
          color: $color;
        }

        .playground-gallery form.playground-gallery-form {

          input.playground-gallery-form-input {
            color: $color;

            &:focus::placeholder {
              color: $color;
            }

          }

          span.playground-gallery-form-border {
            background-color: $color;
          }

        }

      }
    }

  }

</style>

<script lang="ts">
import Vue from "vue";
import { Component } from 'vue-property-decorator';

/** Components */
import Header from '@/components/Header.vue';
import List from "@/components/List.vue";
import Footer from '@/components/Footer.vue';

/** Types */
import { ThemeInfo } from '../components/@types';

/** Custom Modules */
import Helper from "../modules/helper.module";
import BackgroundRippleModule from '../modules/background-ripple.module';
import SecretAdminModule from '../privates/admin.private';
import AuthModule from "../modules/auth.module";


@Component({
  components: {
    Header,
    List,
    Footer
  }
})
export default class Main extends Vue {

  public backgroundTheme?: ThemeInfo;
  public keyTheme?: ThemeInfo;

  public animated: boolean = false;
  public dialogVisibility: boolean = false;
  public formValue: string = '';
  private events: Array<() => void> = []

  private auth = new AuthModule();

  mounted() {
    this.initBackground();
    this.initSecretModule();
  }

  destroyed() {
    for (const remove of this.events) remove();
  }

  public async changeTheme(theme: ThemeInfo): Promise<void> {
    switch (theme.type) {
      case 'background-theme':
        const notFirst = Boolean(this.backgroundTheme);
        this.backgroundTheme = theme;

        if (notFirst) {
          this.animated = true;
          await Helper.wait(1000);
          this.animated = false;
        }
        break;
      case 'key-theme':
        this.keyTheme = theme;
        break;
    }

    this.$forceUpdate();
  }

  public getBackgroundColor(): { backgroundColor?: string } {
    return { backgroundColor: this.backgroundTheme && this.backgroundTheme.color }
  }

  public getBackgroundThemeId(): string {
    return this.backgroundTheme && this.backgroundTheme.id || 'no-theme';
  }

  public getKeyThemeId(): string {
    return this.keyTheme && this.keyTheme.id || 'no-theme';
  }

  public async signIn(): Promise<void> {
    const [username, password] = this.formValue.split('|');

    try {
      await this.auth.signIn(username, password);
      alert('Activate Master mode');
      this.dialogVisibility = false;
      this.formValue = '';
    } catch (error) {
      this.dialogVisibility = false;
    }
  }

  private async initBackground(): Promise<void> {
    const backgroundModule = new BackgroundRippleModule(this.$refs.background as HTMLCanvasElement);
    await backgroundModule.init();

    this.events = [
      Helper.listen(window, 'pointerdown', e => backgroundModule.action(e.clientX, e.clientY)),
      Helper.listen(window, 'resize', () => backgroundModule.update())
    ]
  }

  private initSecretModule(): void {
    const secretModule = new SecretAdminModule();
    secretModule.listen();
    secretModule.onUnlock = () => this.dialogVisibility = true;

    this.events.push(() => secretModule.destroy());
  }

}
</script>
