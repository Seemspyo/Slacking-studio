/** Native Modules */
import { AnimationMetadata, transition, style, animate } from '@angular/animations';

/** Variables */
import { commonTimingFunction } from './@variables.animation';

const
preNAfterTransition = `100ms ${ commonTimingFunction }`,
mainTransition = `300ms ${ commonTimingFunction }`;

export const signInMainButtonAnimation: Array<AnimationMetadata> = [
    transition(':enter', [
        style({ opacity: '0', width: '34px', height: '34px', position: 'absolute', top: '3px', left: '3px', margin: 'auto', color: 'transparent' }),
        animate(preNAfterTransition, style({ opacity: '1' })),
        animate(mainTransition, style({ width: '*', height: '*', top: '0px', left: '0px' })),
        animate(preNAfterTransition, style({ color: '*' }))
    ]),
    transition(':leave', [
        style({ width: '100%', height: '100%', position: 'absolute', top: '0px', left: '0px', margin: 'auto' }),
        animate(preNAfterTransition, style({ color: 'transparent' })),
        animate(mainTransition, style({ width: '34px', height: '34px', top: '3px', left: '3px' })),
        animate(preNAfterTransition, style({ opacity: '0' }))
    ])
]