import { Application, Sprite, Texture, filters, TilingSprite } from 'pixi.js';


export default class BackgroundRippleModule {

    private app: Application;
    private background: TilingSprite;

    constructor(view: HTMLCanvasElement) {
        this.app = new Application({ view, transparent: true });
    }

    public async init(): Promise<void> {
        await this.loadFilterTexture();

        const { renderer, stage, screen } = this.app;
        this.app.resizeTo = window;
        this.app.resize();

        this.updateBackground();
        stage.filterArea = screen;
        stage.filters = []

        renderer.autoDensity = true;
    }

    public update(): void {
        this.app.resize();
        this.updateBackground();
    }

    public action(x: number, y: number): void {
        const { stage, loader } = this.app;

        const filter = new Filter(loader.resources.filter.texture);

        filter.position = { x, y }
        stage.addChild(filter.sprite);
        stage.filters.push(filter.filter);

        const removeTick = this.tick(() => {
            filter.update();

            if (this.isInvisible(filter.sprite)) {
                removeTick();
                stage.filters.splice(stage.filters.indexOf(filter.filter), 1);
                stage.removeChild(filter.sprite);
                filter.sprite.destroy();
            }
        });
    }

    private loadFilterTexture(): Promise<any> {
        const { loader } = this.app;

        return new Promise(resolve => loader.add('background', require('@/assets/images/background.png')).add('filter', require('@/assets/images/filter.png')).load(resolve));
    }

    private tick(func: (...params: Array<any>) => any): () => void {
        const { ticker } = this.app;

        ticker.add(func);
        return () => ticker.remove(func);
    }

    private isInvisible(sprite: Sprite): boolean {
        const { width, height } = this.app.screen;

        const
        bounds = sprite.getBounds(),
        centerWidth = bounds.width * 0.3,
        centerHeight = bounds.height * 0.3;

        return bounds.left + centerWidth < 0
            && bounds.top + centerHeight < 0
            && bounds.right - centerWidth > width
            && bounds.bottom - centerHeight > height;
    }

    private updateBackground(): void {
        const { loader, stage, screen } = this.app;

        if (this.background) {
            stage.removeChild(this.background);
            this.background.destroy();
        }

        this.background = new TilingSprite(loader.resources.background.texture, screen.width, screen.height);
        stage.addChild(this.background);
    }
    
}

class Filter {

    public sprite: Sprite;
    public filter: filters.DisplacementFilter;

    constructor(texture: Texture) {
        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.1);

        this.filter = new filters.DisplacementFilter(this.sprite);
    }

    public set position({ x, y }: { x: number; y: number; }) {
        this.sprite.position.set(x, y);
    }

    public update(): void {
        this.sprite.scale.x += 0.05;
        this.sprite.scale.y += 0.05;
    }

}