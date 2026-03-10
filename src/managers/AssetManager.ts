import { Assets, type Spritesheet, type Texture } from "pixi.js";

export default class AssetManager {
  private static isLoaded = false;
  private static readonly atlasAlias = "cards";
  private static readonly atlasSrc = "./assets/cards.json";

  static async preload(): Promise<void> {
    if (this.isLoaded) {
      return;
    }

    Assets.add({ alias: this.atlasAlias, src: this.atlasSrc });
    await Assets.load(this.atlasAlias);
    this.isLoaded = true;
  }

  static getTexture(alias: string, frameName?: string): Texture {
    const atlas = Assets.get(alias) as Spritesheet | undefined;

    if (!atlas) {
      throw new Error(`Atlas '${alias}' was not loaded before use.`);
    }

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
