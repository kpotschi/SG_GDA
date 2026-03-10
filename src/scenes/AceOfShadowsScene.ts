import { gsap } from "gsap";
import { Sprite } from "pixi.js";
import type DemoApp from "../DemoApp.js";
import type { GameConfig } from "../config/types.js";
import AssetManager from "../managers/AssetManager.js";
import BaseScene from "./BaseScene.js";

type StackCenter = {
  x: number;
  y: number;
};

export default class AceOfShadowsScene extends BaseScene {
  private readonly stacks: Sprite[][] = Array.from({ length: 4 }, () => []);
  private readonly stackCenters: StackCenter[] = Array.from(
    { length: 4 },
    () => ({
      x: 0,
      y: 0,
    }),
  );

  constructor(
    readonly app: DemoApp,
    readonly config: GameConfig,
  ) {
    super(app, config);
    this.root.sortableChildren = true;

    this.createCards();
    this.moveRandomCard();
  }

  private moveRandomCard() {
    const randomStackIndex = Math.floor(Math.random() * this.stacks.length);
    const stack = this.stacks[randomStackIndex];

    const targetStackIndex = randomStackIndex + (1 % this.stacks.length);
    const targetStack = this.stacks[targetStackIndex];

    gsap.to(stack[stack.length - 1], {
      x: targetStack[0].x,
      ease: "sine.inOut",
      duration: 2,
      onComplete: () => {
        const card = stack.pop();
        if (card) {
          stack.unshift(card);
          this.layoutAllStacks();
        }
      },
    });

    gsap.delayedCall(1, () => this.moveRandomCard());
  }

  resize(width: number, height: number): void {
    super.resize(width, height);
    this.updateStackCenters(width, height);
    this.layoutAllStacks();

    this.backButton.position.set(100, 50);
  }

  update(_delta: number): void {}

  private createCards(): void {
    const cardTotal = Number(this.config.data?.CARDS_AMOUNT) || 144;

    for (let i = 0; i < cardTotal; i += 1) {
      const randomTexture = AssetManager.getRandomTexture("cards");

      const card = new Sprite(randomTexture);
      card.anchor.set(0.5, 1);
      this.stacks[Math.floor(Math.random() * 4)].push(card);
      this.root.addChild(card);
    }

    const renderer = this.app.getRenderer();
    this.updateStackCenters(renderer.width, renderer.height);
    this.layoutAllStacks();
  }

  private updateStackCenters(width: number, height: number): void {
    const centerX = width * 0.5;
    const centerY = height * (this.config.data?.STACK_CENTER_Y_RATIO ?? 0.56);
    const radius =
      Math.min(width, height) * (this.config.data?.STACK_RADIUS_RATIO ?? 0.2);

    for (let stackIndex = 0; stackIndex < this.stacks.length; stackIndex += 1) {
      const angleOffset = (Math.PI * 2 * stackIndex) / this.stacks.length;
      const angle = -Math.PI / 2 + angleOffset;
      this.stackCenters[stackIndex] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    }
  }

  private layoutAllStacks(): void {
    for (let i = 0; i < this.stacks.length; i += 1) {
      const stack = this.stacks[i];
      const center = this.stackCenters[i];
      const offsetX = this.config.data?.CARD_STACK_OFFSET_X ?? 0.18;
      const offsetY = this.config.data?.CARD_STACK_OFFSET_Y ?? 0.6;

      stack.forEach((card, index) => {
        card.position.set(
          center.x + index * offsetX,
          center.y - index * offsetY,
        );
        card.zIndex = i * 1000 + index;
      });
    }
  }
}
