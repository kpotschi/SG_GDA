import { Application, Graphics } from 'pixi.js';

/**
 * Bootstrap the PixiJS v8 application and make it responsive.
 */
async function main(): Promise<void> {
    const app = new Application();

    await app.init({
        background: '#1a1a2e',
        resizeTo: window,
        antialias: true,
    });

    // Add canvas to the DOM
    document.body.appendChild(app.canvas);

    // --- Demo scene: a simple animated circle ---
    const circle = new Graphics()
        .circle(0, 0, 60)
        .fill({ color: 0xe94560 });

    app.stage.addChild(circle);

    // Center the circle every frame (handles resize automatically)
    app.ticker.add(() => {
        circle.x = app.screen.width / 2;
        circle.y = app.screen.height / 2;
    });
}

main().catch(console.error);
