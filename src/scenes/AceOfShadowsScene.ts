import { Sprite } from "pixi.js";
import type DemoApp from "../DemoApp.js";
import type { GameConfig } from "../config/types.js";
import AssetManager from "../managers/AssetManager.js";
import gsap from "gsap";
import BaseScene from "./BaseScene.js";
import CardStack from "../entities/CardStack.js";

export default class AceOfShadowsScene extends BaseScene {
  private stacks: CardStack[];
  private queuedCall: gsap.core.Tween | null = null;
  private activeTweens: { tween: gsap.core.Tween; targetStack: CardStack }[] =
    [];

  constructor(
    readonly app: DemoApp,
    readonly config: GameConfig,
  ) {
    super(app, config);
    this.root.sortableChildren = true;

    this.createStacks();
    this.moveRandomCard();
  }

  private moveRandomCard() {
    let randomStackIndex = null;
    let sourceTopCard: Sprite | null = null;
    let sourceStack =
      this.stacks[Math.floor(Math.random() * this.stacks.length)];

    while (!sourceTopCard) {
      randomStackIndex = Math.floor(Math.random() * this.stacks.length);
      sourceStack = this.stacks[randomStackIndex];
      sourceTopCard = sourceStack.getTopCard();
    }

    const targetStackIndex =
      (this.stacks.indexOf(sourceStack) + 1) % this.stacks.length;
    const targetStack = this.stacks[targetStackIndex];

    const cardWorldX = sourceStack.x + sourceTopCard.x;
    const cardWorldY = sourceStack.y + sourceTopCard.y;
    sourceStack.removeTopCard();
    sourceTopCard.position.set(cardWorldX, cardWorldY);
    this.root.addChild(sourceTopCard);

    sourceStack.zIndex = 0;
    targetStack.zIndex = 1;

    const tween = gsap.to(sourceTopCard.position, {
      x: targetStack.x,
      y: targetStack.y,
      ease: "sine.inOut",
      duration: 2,
      onComplete: () => {
        this.root.removeChild(sourceTopCard);
        targetStack.receiveCard(sourceTopCard);
        this.activeTweens = this.activeTweens.filter((t) => t.tween !== tween);
      },
    });

    this.activeTweens.push({ tween, targetStack });

    this.queuedCall = gsap.delayedCall(1, () => this.moveRandomCard());
  }

  resize(width: number, height: number): void {
    super.resize(width, height);
    this.updateStackPositions(width, height);
    this.activeTweens.forEach(({ tween, targetStack }) => {
      tween.vars.x = targetStack.x;
      tween.vars.y = targetStack.y;
      tween.invalidate();
    });
  }

  private updateStackPositions(width: number, height: number): void {
    for (let i = 0; i < this.stacks.length; i += 1) {
      const stack = this.stacks[i];
      const { x, y } = this.getStackPosition(i, this.stacks.length);
      stack.position.set(x, y);
    }
  }

  private getStackPosition(
    index: number,
    total: number,
  ): { x: number; y: number } {
    const renderer = this.app.getRenderer();
    const centerX = renderer.width * 0.5;
    const centerY =
      renderer.height * (this.config.data?.STACK_CENTER_Y_RATIO ?? 0.56);
    const radius =
      Math.min(renderer.width, renderer.height) *
      (this.config.data?.STACK_RADIUS_RATIO ?? 0.2);
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  }

  private createStacks(): void {
    const stackCount = Number(this.config.data?.STACKS_AMOUNT) || 4;

    this.stacks = Array.from({ length: stackCount }, (_, i) => {
      const stack = CardStack.create(this.app, i);
      const { x, y } = this.getStackPosition(i, stackCount);
      stack.position.set(x, y);
      this.root.addChild(stack);
      return stack;
    });

    const cardCount = Number(this.config.data?.CARDS_AMOUNT) || 144;
    for (let i = 0; i < cardCount; i += 1) {
      const randomStackIndex = Math.floor(Math.random() * this.stacks.length);
      this.stacks[randomStackIndex].addCard();
    }

    this.stacks.forEach((stack) => stack.updateCardPositions());
  }

  public exit() {
    this.activeTweens.forEach((tween) => tween.tween.kill());
    this.queuedCall?.kill();
    super.exit();
  }
}
