import { AnimationMetadata, query, style, group, animate } from "@angular/animations";

const
pre = query(':enter, :leave', style({ position: 'fixed', width: '100%', top: '0', right: '0', bottom: '0', left: '0' }), { optional: true }),
scrollFix = query(':leave', [ style({ top: '-{{ scrollTop }}px' }) ], { optional: true }),
timingFunction = '800ms cubic-bezier(0.455, 0.03, 0.515, 0.955)';

export const
slideUp: Array<AnimationMetadata> = [
    pre,
    group([
        query(':enter', [
            style({ transform: 'translateY({{ windowHeight }}px)' }),
            animate(timingFunction, style({ transform: 'translateY(0px)' }))
        ], { optional: true }),
        query(':leave', [
            style({ transform: 'translateY(-{{ scrollTop }}px)' }),
            animate(timingFunction, style({ transform: 'translateY(-{{ windowHeight }}px)' }))
        ], { optional: true })
    ])
],
slideDown: Array<AnimationMetadata> = [
    pre,
    group([
        query(':enter', [
            style({ transform: 'translateY(-{{ windowHeight }}px)' }),
            animate(timingFunction, style({ transform: 'translateY(0%)' }))
        ], { optional: true }),
        query(':leave', [
            style({ transform: 'translateY(0%)' }),
            animate(timingFunction, style({ transform: 'translateY({{ windowHeight }}px)' }))
        ], { optional: true })
    ])
],
slideRight: Array<AnimationMetadata> = [
    pre,
    scrollFix,
    group([
        query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate(timingFunction, style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate(timingFunction, style({ transform: 'translateX(100%)' }))
        ], { optional: true })
    ])
],
slideLeft: Array<AnimationMetadata> = [
    pre,
    scrollFix,
    group([
        query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate(timingFunction, style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate(timingFunction, style({ transform: 'translateX(-100%)' }))
        ], { optional: true })
    ])
]