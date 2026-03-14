import { Assets, Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import AssetManager from "../../managers/AssetManager";

type MessageData = {
  name: string;
  text: string;
  side: "left" | "right";
  avatarUrl?: string;
  emojis?: { name: string; url: string }[];
  maxWidth: number;
};

export default class Message extends Container {
  private bubble: Container;
  private _clipMask: Graphics | null = null;

  constructor(private messageData: MessageData) {
    super();
    this.bubble = new Container();
    this.addChild(this.bubble);
    this.build();
  }

  setVisibleArea(x: number, y: number, w: number, h: number) {
    if (!this._clipMask) {
      this._clipMask = new Graphics();
      this.addChild(this._clipMask);
    }
    this._clipMask.clear();
    const localX = x - this.x;
    const localY = y - this.y;
    this._clipMask.rect(localX, localY, w, h).fill(0xffffff);
    this.mask = this._clipMask;
  }

  clearVisibleArea() {
    if (this._clipMask) {
      this.mask = null;
      this._clipMask.destroy();
      this._clipMask = null;
    }
  }

  private build() {
    const { name, text, side, avatarUrl, emojis, maxWidth } = this.messageData;

    const padding = 4;
    const avatarSize = 20;
    const gap = 4;
    const bubbleMaxW = maxWidth - avatarSize - gap;

    let avatar: Sprite | null = null;
    if (avatarUrl) {
      const tex = AssetManager.getTexture(avatarUrl);

      if (tex) {
        avatar = new Sprite(tex);
        avatar.width = avatarSize;
        avatar.height = avatarSize;
      }
    }

    // name label
    const nameText = new Text({
      text: name,
      style: { fontSize: 9, fill: 0x555555, fontWeight: "bold" },
    });

    // body (text + inline emojis)
    const body = this.buildBody(text, emojis ?? [], bubbleMaxW - padding * 2);

    // background
    const contentW = Math.max(nameText.width, body.width) + padding * 2;
    const contentH = nameText.height + 2 + body.height + padding * 2;

    const bg = new Graphics()
      .roundRect(0, 0, contentW, contentH, 4)
      .fill(side === "left" ? 0xdcf8c6 : 0xffffff);

    // assemble
    const content = new Container();
    content.addChild(bg);
    nameText.position.set(padding, padding);
    content.addChild(nameText);
    body.position.set(padding, padding + nameText.height + 2);
    content.addChild(body);

    if (avatar) {
      if (side === "left") {
        avatar.position.set(0, 0);
        content.position.set(avatarSize + gap, 0);
      } else {
        const totalW = contentW + avatarSize + gap;
        content.position.set(maxWidth - totalW, 0);
        avatar.position.set(maxWidth - avatarSize, 0);
      }
      this.bubble.addChild(avatar);
    } else {
      content.position.set(side === "right" ? maxWidth - contentW : 0, 0);
    }
    this.bubble.addChild(content);
  }

  private buildBody(
    raw: string,
    emojis: { name: string; url: string }[],
    wrapWidth: number,
  ): Container {
    const container = new Container();
    const fontSize = 10;
    const emojiSize = fontSize + 2;
    let cx = 0;
    let cy = 0;

    // Split on {emojiName} tokens
    const parts = raw.split(/(\{[^}]+\})/);

    for (const part of parts) {
      const emojiMatch = part.match(/^\{(.+)\}$/);
      if (emojiMatch) {
        const eName = emojiMatch[1];
        const emojiDef = emojis.find((e) => e.name === eName);

        const textureName = emojiDef ? emojiDef.url : "_missing";
        const tex = AssetManager.getTexture(textureName);

        if (cx + emojiSize > wrapWidth) {
          cx = 0;
          cy += emojiSize + 2;
        }
        const sprite = new Sprite(tex);
        sprite.width = emojiSize;
        sprite.height = emojiSize;
        sprite.position.set(cx, cy);
        container.addChild(sprite);
        cx += emojiSize + 1;
        continue;
      }

      // Plain text – word-wrap manually
      const words = part.split(/(\s+)/);
      for (const word of words) {
        if (word.length === 0) continue;
        const t = new Text({
          text: word,
          style: { fontSize, fill: 0x000000 },
        });
        if (cx + t.width > wrapWidth && cx > 0) {
          cx = 0;
          cy += fontSize + 2;
        }
        t.position.set(cx, cy);
        container.addChild(t);
        cx += t.width;
      }
    }

    return container;
  }
}
