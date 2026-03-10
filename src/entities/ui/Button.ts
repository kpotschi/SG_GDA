import { Container, Graphics, Text } from "pixi.js";
import { GameConfig } from "../../config/types";
import BaseScene from "../../scenes/BaseScene";
import DemoApp from "../../DemoApp";

export default class Button extends Container {
  private background: Graphics;
  private text: Text;

  constructor(
    readonly app: DemoApp,
    readonly config: GameConfig,
  ) {
    super();
    this.addBackground();
    this.addText();
    this.makeInteractive();
  }

  private addBackground() {
    this.background = new Graphics()
      .roundRect(-140, -30, 280, 60, 10)
      .fill(0x2a5f8f);

    this.addChild(this.background);
  }

  private addText() {
    this.text = new Text({
      text: this.config.name,
      style: {
        fontSize: 28,
        fill: 0xffffff,
      },
    });
    this.text.anchor.set(0.5);

    this.addChild(this.text);
  }

  private makeInteractive() {
    this.eventMode = "static";
    this.cursor = "pointer";
    this.once("pointertap", () => this.app.goToScene(this.config.id));

    this.on("pointerover", () => {
      this.background.tint = 0x4c7aa3;
    });
    this.on("pointerout", () => {
      this.background.tint = 0xffffff;
    });
  }

  static create(app: DemoApp, config: GameConfig): Button {
    const button = new Button(app, config);
    return button;
  }
}
