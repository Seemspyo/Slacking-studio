/** Native Modules */
import { AnimationMetadata, transition, style, animate, query, group } from '@angular/animations';

/** Variables */
import { commonTimingFunction } from './@variables.animation';


export const fadeEnterLeave: Array<AnimationMetadata> = [
    transition(':enter', [
        style({ opacity: '0', position: 'absolute' }),
        animate(`300ms ${ commonTimingFunction }`, style({ opacity: '1' }))
    ]),
    transition(':leave', [
        style({ position: 'absolute' }),
        animate(`300ms ${ commonTimingFunction }`, style({ opacity: '0' }))
    ])
]

export const
fadeToggle: Array<AnimationMetadata> = [
    query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
    query(':enter', [
        style({ zIndex: '0' })
    ], { optional: true }),
    query(':leave', [
        style({ zIndex: '6', top: '-{{ top }}px' })
    ], { optional: true }),
    group([
        query(':enter', [
            style({ opacity: '0' }),
            animate(`300ms ${ commonTimingFunction }`, style({ opacity: '1' }))
        ], { optional: true }),
        query(':leave', [
            style({ opacity: '1' }),
            animate(`500ms ${ commonTimingFunction }`, style({ opacity: '0' }))
        ], { optional: true })
    ])
]