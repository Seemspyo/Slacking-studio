import { AnimationMetadata, style, animate, transition } from "@angular/animations";

export const
settle: Array<AnimationMetadata> = [
    transition(':enter', [
        style({ opacity: '.4', transform: 'translateY(-10%)' }),
        animate('800ms cubic-bezier(0.455, 0.03, 0.515, 0.955)', style({ opacity: '1', transform: 'translateY(0%)' }))
    ])
]