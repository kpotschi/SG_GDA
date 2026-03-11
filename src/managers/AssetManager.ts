import { Assets, Texture, type Spritesheet } from "pixi.js";

export default class AssetManager {
  private static isLoaded = false;

  static async preload(): Promise<void> {
    if (this.isLoaded) {
      return;
    }

    Assets.add([
      { alias: "cards", src: "./assets/images/cards.json" },
      { alias: "nokia", src: "./assets/images/nokia.jpg" },
    ]);
    await Assets.load(["cards", "nokia"]);
    this.isLoaded = true;
  }

  static getTexture(alias: string, frameName?: string): Texture {
    const asset = Assets.get(alias);

    if (!asset) {
      throw new Error(`Asset '${alias}' was not loaded before use.`);
    }

    // Plain texture (e.g. a .jpg/.png)
    if (asset instanceof Texture) {
      return asset;
    }

    // Spritesheet atlas
    const atlas = asset as Spritesheet;

    if (!frameName) {
      const firstTexture = Object.values(atlas.textures)[0];

      if (!firstTexture) {
        throw new Error(`Atlas '${alias}' does not contain any frames.`);
      }

      return firstTexture;
    }

    const texture = atlas.textures[frameName];

    if (!texture) {
      throw new Error(
        `Frame '${frameName}' was not found in atlas '${alias}'.`,
      );
    }

    return texture;
  }

  static getRandomTexture(alias: string): Texture {
    const atlas = Assets.get(alias) as Spritesheet | undefined;

    if (!atlas) {
      throw new Error(`Atlas '${alias}' was not loaded before use.`);
    }

    const frames = Object.values(atlas.textures);

    if (frames.length === 0) {
      throw new Error(`Atlas '${alias}' does not contain any frames.`);
    }

    const randomIndex = Math.floor(Math.random() * frames.length);
    return frames[randomIndex];
  }
}
