import { Position } from './@types';


export class DetectHelper {

    private positions: Position = {
        x: void(0),
        y: void(0)
    }
    private initialized: boolean = false;

    constructor() {}

    public init(x: number, y: number): void {
        this.positions = { x, y }
        this.initialized = true;
    }

    public detect(axis: 'x' | 'y', moveX: number, moveY: number): boolean {
        if (!this.initialized) return false;

        const { x, y } = this.positions;
        const
        distanceX = Math.abs(x - moveX),
        distanceY = Math.abs(y - moveY);

        switch (axis) {
            case 'x':
                return distanceX >= distanceY && distanceX >= 30;
            case 'y':
                return distanceY >= distanceX && distanceY >= 30;
        }
    }

    public reset(): void {
        if (this.initialized) {
            this.positions = { x: void(0), y: void(0) }
            this.initialized = false;
        }
    }

}