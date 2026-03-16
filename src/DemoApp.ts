import { Application, Renderer } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import Stats from "stats.js";
import AssetManager from "./managers/AssetManager.js";
import SceneManager from "./managers/SceneManager.js";

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
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
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

    //debug

    const stats = new Stats();
    stats.showPanel(0);
    stats.dom.style.position = "absolute";
    stats.dom.style.left = "0px";
    stats.dom.style.top = "0px";
    document.body.appendChild(stats.dom);

    this.pixiApp.ticker.add(() => {
      stats.update();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    });

    const hint = document.createElement("div");
    hint.textContent = "Press F for fullscreen";
    Object.assign(hint.style, {
      position: "fixed",
      bottom: "10px",
      left: "10px",
      color: "rgba(255,255,255,0.4)",
      fontSize: "12px",
      fontFamily: "sans-serif",
      pointerEvents: "none",
    });
    document.body.appendChild(hint);
  }

  public getRenderer(): Renderer {
    return this.pixiApp.renderer;
  }

  private readonly handleResize = (): void => {
    this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
    this.sceneManager?.resize(
      this.pixiApp.screen.width,
      this.pixiApp.screen.height,
    );
  };

  public goToScene(sceneId: string): void {
    this.sceneManager.switchTo(sceneId as any);
  }
}
