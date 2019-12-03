/** Native Modules */
import { AnimationMetadata, transition, style, animate } from '@angular/animations';

/** Variables */
import { commonTimingFunction } from './@variables.animation';


export const toggleSlideDown: Array<AnimationMetadata> = [
    transition(':enter', [
        style({ height: '0px', opacity: '0', minHeight: 'auto' }),
        animate(`500ms ${ commonTimingFunction }`, style({ height: '*', opacity: '1' }))
    ]),
    transition(':leave', [
        style({ minHeight: 'auto'  }),
        animate(`500ms ${ commonTimingFunction }`, style({ height: '0px', opacity: '0' }))
    ])
]