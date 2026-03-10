import { Application } from "pixi.js";
import MenuScene from "../scenes/MenuScene.js";
import SceneOne from "../scenes/AceOfShadowsScene.js";
import SceneThree from "../scenes/PhoenixFlameScene.js";
import SceneTwo from "../scenes/MagicWordsScene.js";
import BaseScene from "../scenes/BaseScene.js";
import { CONSTANTS } from "../config/CONSTANTS.js";
import DemoApp from "../DemoApp.js";

export default class SceneManager {
  private activeScene: BaseScene | null = null;

  constructor(readonly app: DemoApp) {}

  switchTo(sceneId: string): void {
    if (this.activeScene) {
      this.app.pixiApp.stage.removeChild(this.activeScene.view);
      this.activeScene.exit();
      this.activeScene = null;
    }

    const nextSceneConfig = CONSTANTS.AVAILABLE_GAMES.find(
      (game) => game.id === sceneId,
    );

    let nextScene = null;
    if (!nextSceneConfig) {
      nextScene = new MenuScene(this.app);
    } else {
      nextScene = new nextSceneConfig.class(this.app, nextSceneConfig);
    }

    this.activeScene = nextScene;

    this.app.pixiApp.stage.addChild(nextScene.view);
    nextScene.enter();

    nextScene.resize(
      this.app.pixiApp.renderer.width,
      this.app.pixiApp.renderer.height,
    );
  }

  update(delta: number): void {
    this.activeScene?.update(delta);
  }

  resize(width: number, height: number): void {
    this.activeScene?.resize(width, height);
  }

  //   private createScene(sceneId: SceneId): BaseScene {
  //     const context: SceneContext = {
  //       app: this.app,
  //       goToScene: (nextScene) => this.switchTo(nextScene),
  //     };

  //     switch (sceneId) {
  //       case "menu":
  //         return new MenuScene(context);
  //       case "sceneOne":
  //         return new SceneOne(context);
  //       case "sceneTwo":
  //         return new SceneTwo(context);
  //       case "sceneThree":
  //         return new SceneThree(context);
  //       default:
  //         return new MenuScene(context);
  //     }
  //   }
}
