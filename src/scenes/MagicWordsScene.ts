import { Container, Graphics, Sprite, Text } from "pixi.js";
// import AssetManager from "../managers/AssetManager.js";
import BaseScene from "./BaseScene.js";
import type DemoApp from "../DemoApp.js";
import type { GameConfig } from "../config/types.js";

export default class MagicWordsScene extends BaseScene {
  private readonly card: Sprite;

  constructor(
    readonly app: DemoApp,
    readonly config: GameConfig,
  ) {
    super(app, config);

    this.card = new Sprite();
    // AssetManager.getTexture("cardsAtlas", "tarot__3_pentacles.png"),
    this.card.scale.set(3);

    this.root.addChild(this.title, this.card, this.backButton);
  }

  resize(width: number, height: number): void {
    super.resize(width, height);
    // this.title.anchor.set(0.5);
    // this.title.position.set(width * 0.5, height * 0.15);

    // this.card.anchor.set(0.5);
    // this.card.position.set(width * 0.5, height * 0.5);

    this.backButton.position.set(100, 50);
  }
}
