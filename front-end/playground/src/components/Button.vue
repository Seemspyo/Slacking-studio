<template>
    <button
        :id="id"
        class="playground-button" :class="{ 'button-pressed': pressed }"
        :button-type="styleType"
        type="button"
        @click="$emit('click', $event)"
        @mouseenter="$emit('mouseenter', $event)"
        @mouseleave="$emit('mouseleave', $event)"
        @mousemove="$emit('mousemove', $event)"
        @touchstart="$emit('touchstart', $event)"
        @touchend="$emit('touchend', $event)"
        @touchmove="$emit('touchmove', $event)"
    >
        <div class="playground-button-content">
            <slot></slot>
        </div>
    </button>
</template>

<style lang="scss">
    @import '@/variables';

    $DURATION: 500ms;
    $DEFAULT-BACKGROUND-COLOR: #000;

    button.playground-button {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition-duration: $DURATION;
        background-color: transparent;

        &[button-type=square] {
            border-radius: 2px;
            min-width: 88px; min-height: 32px;

            .playground-button-content {
                padding: 0 8px;
            }

        }
        

        &[button-type=round] {
            border-radius: 50%;
            width: 36px; height: 36px;
        }

        &:hover {

            &::before {
                opacity: .1;
            }

        }

        &.button-pressed {

            &::before {
                transition-delay: $DURATION;
                opacity: .3;
            }

        }

        &::before {
            content: '';
            display: block;
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 0;
            opacity: 0;
            background-color: $DEFAULT-BACKGROUND-COLOR;
            background-color: var(--ripple-background-color, #{ $DEFAULT-BACKGROUND-COLOR });
            transition: opacity $DURATION;
        }

        .playground-button-content {
            z-index: 2;
            width: 100%; height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        @keyframes Ripple {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            50% {
                transform: scale(2);
                opacity: .2;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }

        .playground-button-ripple {
            position: absolute;
            display: block;
            z-index: 1;
            border-radius: 50%;
            animation: {
                name: Ripple;
                duration: $DURATION * 2;
                iteration-count: infinite;
                direction: alternate;
                timing-function: $RIPPLE-TIMING-FUNCTION;
            }
            background-color: $DEFAULT-BACKGROUND-COLOR;
            background-color: var(--ripple-background-color, #{ $DEFAULT-BACKGROUND-COLOR });
        }

    }
</style>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

/** Custom Modules */
import Helper from '../modules/helper.module';

/** Types */
import { PointerXY } from './@types';


@Component
export default class Button extends Vue {

    private detachFuncs: Array<() => void> = []

    @Prop(Boolean) centered?: boolean;
    @Prop() type?: 'round' | 'square';
    @Prop() id?: string;

    public pressed: boolean = false;

    mounted() {
        this.attach();
    }

    destroyed() {
        this.detach();
    }

    public get styleType(): string {
        return this.type || 'square';
    }

    private attach(): void {
        const handler = this.handlePointerEvents.bind(this);

        for (const type of ['pointerdown', 'pointerleave']) this.detachFuncs.push(Helper.listen(this.$el, type, handler));
        this.detachFuncs.push(Helper.listen(window, 'pointerup', handler));
    }

    private detach(): void {
        for (const removeListener of this.detachFuncs) removeListener();
    }

    private handlePointerEvents(event: PointerEvent): void {
        switch (event.type) {
            case 'pointerdown':
                this.pressed = true;
                this.dispatchRippleEl(this.toRelativePosition({ x: event.pageX, y: event.pageY }));
                break;
            case 'pointerup':
                this.pressed = false;
                break;
            case 'pointerleave':
                if (this.pressed) this.pressed = false;
                break;
        }
    }

    private dispatchRippleEl({ x, y }: PointerXY): void {
        const
        el = this.$el as HTMLElement,
        duration = Number.parseFloat(window.getComputedStyle(el).transitionDuration) * 1000,
        diameter = Math.max(el.offsetWidth, el.offsetHeight),
        rippleEl = document.createElement('span');

        rippleEl.classList.add('playground-button-ripple');
        Helper.assignStyle(rippleEl, {
            top: this.px( (this.centered ? el.offsetWidth / 2 : y) - diameter / 2 ),
            left: this.px( (this.centered ? el.offsetWidth / 2 : x) - diameter / 2),
            width: this.px(diameter),
            height: this.px(diameter)
        });

        el.appendChild(rippleEl);
        window.setTimeout(() => el.removeChild(rippleEl), duration * 2);
    }

    private px(value: number): string {
        return `${ value }px`;
    }

    private toRelativePosition(coords: PointerXY): PointerXY {
        const { offsetTop, offsetLeft } = this.$el as HTMLElement;

        return { x: coords.x - offsetLeft, y: coords.y - offsetTop }
    }

}
</script>