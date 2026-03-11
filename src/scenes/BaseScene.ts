import { Container, Graphics, Text } from "pixi.js";
import type DemoApp from "../DemoApp.js";
import type { GameConfig } from "../config/types.js";

const BACK_BUTTON_COLOR = 0xcfa5b4;

export default abstract class BaseScene {
  protected readonly root: Container;
  protected title: Text;
  protected backButton: Container;

  constructor(
    readonly app: DemoApp,
    readonly config: Omit<GameConfig, "class">,
  ) {
    this.root = new Container();

    if (config) {
      this.addTitle();
    }

    if (config.id !== "menu") {
      this.addBackButton();
    }
  }

  private addTitle() {
    this.title = new Text({
      text: this.config?.name,
      style: {
        fontSize: 44,
        fill: 0xffffff,
        fontWeight: "700",
      },
    });

    this.title.position.set(
      this.app.pixiApp.renderer.width * 0.5,
      this.app.pixiApp.renderer.height * 0.22,
    );

    this.root.addChild(this.title);
  }

  get view(): Container {
    return this.root;
  }

  public enter(): void {
    const renderer = this.app.getRenderer();
    this.resize(renderer.width, renderer.height);
  }

  update(_delta: number): void {}

  resize(_width: number, _height: number): void {
    this.title.anchor.set(0.5);
    this.title.position.set(_width * 0.5, _height * 0.1);
    this.backButton?.position.set(_width - 100, 50);
  }

  exit(): void {
    this.root.destroy({ children: true });
  }

  private addBackButton() {
    this.backButton = new Container();
    const bg = new Graphics()
      .roundRect(-70, -22, 140, 44, 8)
      .fill(BACK_BUTTON_COLOR);
    const text = new Text({
      text: "Back",
      style: {
        fill: 0x000000,
        fontSize: 24,
      },
    });

    text.anchor.set(0.5);

    this.backButton.eventMode = "static";
    this.backButton.cursor = "pointer";
    this.backButton.once("pointertap", () => this.app.goToScene("menu"));
    this.backButton.addChild(bg, text);

    this.root.addChild(this.backButton);
  }
}
