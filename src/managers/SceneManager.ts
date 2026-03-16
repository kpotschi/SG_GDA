import DemoApp from "../DemoApp.js";
import { AVAILABLE_GAMES } from "../config/AVAILABLE_GAMES.js";
import BaseScene from "../scenes/BaseScene.js";
import MenuScene from "../scenes/MenuScene.js";

export default class SceneManager {
  private activeScene: BaseScene | null = null;

  constructor(readonly app: DemoApp) {}

  switchTo(sceneId: string): void {
    if (this.activeScene) {
      this.app.pixiApp.stage.removeChild(this.activeScene.view);
      this.activeScene.exit();
      this.activeScene = null;
    }

    const nextSceneConfig = AVAILABLE_GAMES.find((game) => game.id === sceneId);

    let nextScene = null;
    if (!nextSceneConfig) {
      nextScene = new MenuScene(this.app);
    } else {
      nextScene = new nextSceneConfig.class(this.app, nextSceneConfig);
    }

    this.activeScene = nextScene;

    this.app.pixiApp.stage.addChild(nextScene.view);
    nextScene.enter();
  }

  update(delta: number): void {
    this.activeScene?.update(delta);
  }

  resize(width: number, height: number): void {
    this.activeScene?.resize(width, height);
  }
}
