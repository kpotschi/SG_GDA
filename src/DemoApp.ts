import { Application, Renderer } from "pixi.js";
// import AssetManager from "./managers/AssetManager.js";
import SceneManager from "./managers/SceneManager.js";
import { CONSTANTS } from "./config/CONSTANTS.js";
import AssetManager from "./managers/AssetManager.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import Stats from "stats.js";

export default class DemoApp {
  public readonly pixiApp: Application;
  public sceneManager: SceneManager;

  constructor() {
    this.pixiApp = new Application();
    this.boot();
  }

  private async boot(): Promise<void> {
    await this.pixiApp.init({
      background: 0x121d2d,
      antialias: true,
      resizeTo: window,
    });

    gsap.registerPlugin(PixiPlugin);

    const canvasContainer = document.getElementById("game");

    if (!canvasContainer) throw new Error("Missing #game root element.");

    canvasContainer.appendChild(this.pixiApp.canvas);

    await AssetManager.preload();

    this.sceneManager = new SceneManager(this);
    this.sceneManager.switchTo("menu");

    this.pixiApp.ticker.add((ticker) => {
      this.sceneManager?.update(ticker.deltaTime);
    });

    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    const stats = new Stats();
    stats.showPanel(0);
    stats.dom.style.position = "absolute";
    stats.dom.style.left = "0px";
    stats.dom.style.top = "0px";
    document.body.appendChild(stats.dom);

    this.pixiApp.ticker.add(() => {
      stats.update();
    });

    //debug
  }

  public getRenderer(): Renderer {
    return this.pixiApp.renderer;
  }

  private readonly handleResize = (): void => {
    this.sceneManager?.resize(
      this.pixiApp.renderer.width,
      this.pixiApp.renderer.height,
    );
  };

  public goToScene(sceneId: string): void {
    this.sceneManager.switchTo(sceneId as any);
  }
}
