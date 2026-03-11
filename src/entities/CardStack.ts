import { Assets, Container, Sprite } from "pixi.js";
import DemoApp from "../DemoApp";
import AssetManager from "../managers/AssetManager";

export default class CardStack extends Container {
  constructor(
    readonly app: DemoApp,
    readonly index: number,
  ) {
    super();
    this.sortableChildren = true;
  }

  static create(app: DemoApp, index: number): CardStack {
    const stack = new CardStack(app, index);
    return stack;
  }

  public addCard(): void {
    const randomTexture = AssetManager.getRandomTexture("cards");
    const card = new Sprite(randomTexture);
    card.anchor.set(0.5);
    card.scale.set(1.5);

    this.addChild(card);
  }

  public updateCardPositions(): void {
    this.children.forEach((card, i) => {
      card.position.set(1 * i, 2 * i);
    });
  }

  public getTopCard(): Sprite | null {
    const topCard = this.children[this.children.length - 1];
    return topCard instanceof Sprite ? topCard : null;
  }

  public receiveCard(card: Sprite): void {
    card.position.set(0, 0);
    this.addChildAt(card, 0);
    this.updateCardPositions();
  }

  public removeTopCard(): void {
    this.removeChild(this.children[this.children.length - 1]);
  }
}
