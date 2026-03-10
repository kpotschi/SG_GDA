import { Container, Graphics, Sprite, Text } from "pixi.js";
import BaseScene from "./BaseScene.js";
import type DemoApp from "../DemoApp.js";
import type { GameConfig } from "../config/types.js";

export default class PhoenixFlameScene extends BaseScene {
  private readonly card: Sprite;

  constructor(
    readonly app: DemoApp,
    readonly config: GameConfig,
  ) {
    super(app, config);

    this.card = new Sprite();
    // AssetManager.getTexture("cardsAtlas", "tarot__4_wands.png"),
    this.card.scale.set(3);

    this.root.addChild(this.title, this.card, this.backButton);
  }

  resize(width: number, height: number): void {
    super.resize(width, height);

    // this.card.anchor.set(0.5);
    // this.card.position.set(width * 0.5, height * 0.5);

    this.backButton.position.set(100, 50);
  }
}
