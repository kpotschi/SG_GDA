import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import BaseScene from "./BaseScene.js";
import type DemoApp from "../DemoApp.js";
import type { GameConfig } from "../config/types.js";
import AssetManager from "../managers/AssetManager.js";
import Message from "../entities/ui/Message.js";

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
  private messageList: Container;
  private messageWidgets: Message[] = [];
  private messages: MessageData | null = null;
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
      this.app.pixiApp.screen.width * 0.55,
      this.app.pixiApp.screen.height * 0.5,
    );
    this.root.addChild(this.phone);
  }

  private addScreen() {
    this.screenContainer = new Container();
    this.phone.addChild(this.screenContainer);

    const sx =
      this.config.data!.SCREEN_OFFSET_X - this.config.data!.SCREEN_WIDTH / 2;
    const sy =
      this.config.data!.SCREEN_OFFSET_Y - this.config.data!.SCREEN_HEIGHT / 2;
    const sw = this.config.data!.SCREEN_WIDTH;
    const sh = this.config.data!.SCREEN_HEIGHT;

    const bg = new Graphics().roundRect(sx, sy, sw, sh, 5).fill("#276f24");
    this.screenContainer.addChild(bg);

    // Clipping mask for messages
    const clipMask = new Graphics().rect(sx, sy, sw, sh).fill(0xffffff);
    this.screenContainer.addChild(clipMask);

    this.messageList = new Container();
    this.messageList.position.set(sx + 4, sy + 4);
    this.messageList.mask = clipMask;
    this.screenContainer.addChild(this.messageList);

    this.screenText = new Text({
      text: "Starting...",
      style: {
        fontSize: 16,
        fill: 0x000000,
        wordWrap: true,
        wordWrapWidth: sw - 10,
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
      this.messages = await res.json();

      const urls = [
        ...(this.messages?.avatars?.map((a) => a.url) ?? []),
        ...(this.messages?.emojies?.map((e) => e.url) ?? []),
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
    const dialogue = this.messages?.dialogue ?? [];
    if (dialogue.length === 0) {
      this.screenText.text = "No new messages :(";
      return;
    }

    // Hide the placeholder text
    this.screenText.visible = false;

    const avatars = this.messages?.avatars ?? [];
    const emojis = this.messages?.emojies ?? [];
    const sw = this.config.data!.SCREEN_WIDTH - 8; // padding each side

    let yOffset = 0;
    for (const entry of dialogue) {
      const avatar = avatars.find((a) => a.name === entry.name);
      const msg = new Message({
        name: entry.name,
        text: entry.text,
        side: avatar?.position ?? "left",
        avatarUrl: avatar?.url,
        emojis,
        maxWidth: sw,
      });
      msg.position.set(0, yOffset);
      this.messageList.addChild(msg);
      this.messageWidgets.push(msg);
      yOffset += msg.height + 4;
    }

    // Auto-scroll if messages overflow the screen
    const sh = this.config.data!.SCREEN_HEIGHT - 8;
    if (yOffset > sh) {
      let scrollY = 0;
      const totalScroll = yOffset - sh;
      this.messageInterval = window.setInterval(() => {
        scrollY += 0.5;
        if (scrollY > totalScroll + sh) scrollY = -sh; // loop
        this.messageList.y =
          this.config.data!.SCREEN_OFFSET_Y -
          this.config.data!.SCREEN_HEIGHT / 2 +
          4 -
          Math.max(0, Math.min(scrollY, totalScroll));
      }, 30);
    }
  }

  public resize(width: number, height: number): void {
    super.resize(width, height);
    this.phone.position.set(width * 0.5, height * 0.55);
    const ratio = Math.min(width / 800, height / 1200);
    this.phone.scale.set(ratio * 1.3);
  }

  public exit(): void {
    if (this.messageInterval !== null) {
      clearInterval(this.messageInterval);
    }
    super.exit();
  }
}
