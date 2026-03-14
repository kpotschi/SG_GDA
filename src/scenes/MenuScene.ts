import { Container, Graphics, Text } from "pixi.js";
import BaseScene from "./BaseScene.js";
import type { GameConfig } from "../config/types.js";
import Button from "../entities/ui/Button.js";
import type DemoApp from "../DemoApp.js";
import { AVAILABLE_GAMES } from "../config/AVAILABLE_GAMES.js";

export default class MenuScene extends BaseScene {
  private readonly menuButtons: Container[] = [];

  constructor(readonly app: DemoApp) {
    super(app, {
      id: "menu",
      name: "Kevin's Corner",
      description: "Select a game to play",
    });

    this.root.addChild(this.title);
  }

  enter(): void {
    AVAILABLE_GAMES.forEach((config: GameConfig) => {
      const button = Button.create(this.app, config);
      this.menuButtons.push(button);
      this.root.addChild(button);
    });

    const renderer = this.app.getRenderer();
    this.resize(renderer.width, renderer.height);
  }

  resize(width: number, height: number): void {
    this.menuButtons.forEach((button, index) => {
      button.position.set(width * 0.5, height * 0.42 + index * 100);
    });

    super.resize(width, height);
  }
}
