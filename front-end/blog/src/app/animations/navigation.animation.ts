/** Native Modules */
import { AnimationMetadata, transition, style, animate } from '@angular/animations';

/** Variables */
import { commonTimingFunction } from './@variables.animation';


export const slide: Array<AnimationMetadata> = [
    transition('void => in', [
        style({ width: '0px' }),
        animate(`1000ms ${ commonTimingFunction }`, style({ width: '*' }))
    ]),
    transition('in => void', [
        animate(`1000ms ${ commonTimingFunction }`, style({ width: '0px' }))
    ])
]

export const slideFast: Array<AnimationMetadata> = [
    transition(':enter', [
        style({ width: '0px' }),
        animate(`500ms ${ commonTimingFunction }`, style({ width: '*' }))
    ]),
    transition(':leave', [
        animate(`500ms ${ commonTimingFunction }`, style({ width: '0px' }))
    ])
]