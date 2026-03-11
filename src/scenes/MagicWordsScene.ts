import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import BaseScene from "./BaseScene.js";
import type DemoApp from "../DemoApp.js";
import type { GameConfig } from "../config/types.js";
import AssetManager from "../managers/AssetManager.js";

type Avatar = {
  name: string;
  url: string;
  position: "left" | "right";
};

type DialogueEntry = { name: string; text: string };
type Emoji = { name: string; url: string };

type MessageData = {
  avatars: Avatar[];
  dialogue: DialogueEntry[];
  emojies: Emoji[];
};

export default class MagicWordsScene extends BaseScene {
  private phone: Sprite;
  private screenContainer: Container;
  private screenText: Text;
  private messages: string[] = [];
  private messageInterval: number | null = null;

  constructor(
    readonly app: DemoApp,
    readonly config: GameConfig,
  ) {
    super(app, config);

    this.addPhoneBg();
    this.addScreen();
    this.fetchMessages();
  }

  private addPhoneBg() {
    this.phone = Sprite.from(AssetManager.getTexture("nokia"));
    this.phone.anchor.set(0.5);
    this.phone.scale.set(1.3);
    this.phone.position.set(
      this.app.pixiApp.renderer.width * 0.55,
      this.app.pixiApp.renderer.height * 0.5,
    );
    this.root.addChild(this.phone);
  }

  private addScreen() {
    this.screenContainer = new Container();
    this.phone.addChild(this.screenContainer);

    const bg = new Graphics()
      .roundRect(
        this.config.data!.SCREEN_OFFSET_X - this.config.data!.SCREEN_WIDTH / 2,
        this.config.data!.SCREEN_OFFSET_Y - this.config.data!.SCREEN_HEIGHT / 2,
        this.config.data!.SCREEN_WIDTH,
        this.config.data!.SCREEN_HEIGHT,
        5,
      )
      .fill("#276f24");
    this.screenContainer.addChild(bg);

    this.screenText = new Text({
      text: "Starting...",
      style: {
        fontSize: 16,
        fill: 0x000000,
        wordWrap: true,
        wordWrapWidth: this.config.data!.SCREEN_WIDTH - 10,
        align: "left",
      },
    });
    this.screenText.anchor.set(0.5);
    this.screenText.position.set(
      this.config.data!.SCREEN_OFFSET_X,
      this.config.data!.SCREEN_OFFSET_Y,
    );
    this.screenContainer.addChild(this.screenText);
  }

  private async fetchMessages() {
    try {
      const res = await fetch(this.config.data!.API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: MessageData = await res.json();

      const urls = [
        ...(data.avatars?.map((a) => a.url) ?? []),
        ...(data.emojies?.map((e) => e.url) ?? []),
      ];

      await Promise.allSettled(
        urls.map((url) =>
          Promise.race([
            Assets.load({ src: url, parser: "loadTextures" }),
            new Promise((_, reject) =>
              setTimeout(() => reject("timeout"), 2000),
            ),
          ]),
        ),
      ).then(() => this.showMessages());
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      this.screenText.text = "No one texted :(";
    }
  }

  private showMessages() {
    if (this.messages.length === 0) {
      this.screenText.text = "No new messages :(";
      return;
    }

    let index = 0;
    this.screenText.text = this.messages[index];

    if (this.messages.length > 1) {
      this.messageInterval = window.setInterval(() => {
        index = (index + 1) % this.messages.length;
        this.screenText.text = this.messages[index];
      }, 3000);
    }
  }

  resize(width: number, height: number): void {
    super.resize(width, height);
    this.phone.position.set(width * 0.5, height * 0.55);
  }

  exit(): void {
    if (this.messageInterval !== null) {
      clearInterval(this.messageInterval);
    }
    super.exit();
  }
}
