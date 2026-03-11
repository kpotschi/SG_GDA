import { Container, Graphics, Sprite, Text } from "pixi.js";
// import AssetManager from "../managers/AssetManager.js";
import BaseScene from "./BaseScene.js";
import type DemoApp from "../DemoApp.js";
import type { GameConfig } from "../config/types.js";
import AssetManager from "../managers/AssetManager.js";

export default class MagicWordsScene extends BaseScene {
  private readonly card: Sprite;
  private phone: Sprite;

  constructor(
    readonly app: DemoApp,
    readonly config: GameConfig,
  ) {
    super(app, config);

    this.addPhoneBg();
  }

  private addPhoneBg() {
    this.phone = Sprite.from(AssetManager.getTexture("nokia"));
    this.phone.anchor.set(0.5);
    this.phone.scale.set(1.3);
    this.phone.position.set(
      this.app.pixiApp.renderer.width * 0.5,
      this.app.pixiApp.renderer.height * 0.7,
    );
    this.root.addChild(this.phone);
  }

  resize(width: number, height: number): void {
    super.resize(width, height);
    this.phone.position.set(width * 0.5, height * 0.7);
  }
}
