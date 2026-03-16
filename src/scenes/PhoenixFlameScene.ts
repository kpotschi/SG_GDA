import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";
import BaseScene from "./BaseScene.js";
import type DemoApp from "../DemoApp.js";
import type { GameConfig } from "../config/types.js";
import AssetManager from "../managers/AssetManager.js";

export default class PhoenixFlameScene extends BaseScene {
  private fireContainer: Container;
  private particles: Sprite[] = [];
  private centerX = 0;
  private baseY = 0;
  private running = false;

  constructor(
    readonly app: DemoApp,
    readonly config: GameConfig,
  ) {
    super(app, config);
    console.log(config);

    this.fireContainer = new Container();
    this.root.addChild(this.fireContainer);
  }

  enter(): void {
    super.enter();
    this.running = true;
    const maxParticles = this.config.data?.MAX_PARTICLES || 10;
    for (let i = 0; i < maxParticles; i++) {
      this.spawnParticle();
    }
  }

  private spawnParticle(): void {
    if (!this.running) return;

    const frame =
      this.config.data?.FIRE_FRAMES[
        Math.floor(Math.random() * this.config.data?.FIRE_FRAMES.length)
      ];

    const texture = AssetManager.getTexture("particles", frame);

    const sprite = new Sprite(texture);

    sprite.anchor.set(0.5);

    const spread = 60;
    const startX = this.centerX + (Math.random() - 0.5) * spread;
    const startY = this.baseY;

    sprite.position.set(startX, startY);
    const startScale = 0.8 + Math.random() * 1.2;
    sprite.scale.set(startScale);
    sprite.alpha = 0;

    this.fireContainer.addChild(sprite);
    this.particles.push(sprite);

    const riseDist = 150 + Math.random() * 100;
    const drift = (Math.random() - 0.5) * 80;
    const duration = 1.0 + Math.random() * 1.0;
    const delay = Math.random() * 1.5;

    gsap.to(sprite, {
      y: startY - riseDist,
      x: startX + drift,
      duration,
      delay,
      ease: "power1.out",
    });

    gsap.to(sprite, {
      alpha: 1,
      duration: duration * 0.2,
      delay,
      ease: "power1.in",
    });

    gsap.to(sprite, {
      alpha: 0,
      duration: duration * 0.4,
      delay: delay + duration * 0.6,
      ease: "power1.out",
      onComplete: () => this.recycleParticle(sprite),
    });
  }

  private recycleParticle(sprite: Sprite): void {
    const idx = this.particles.indexOf(sprite);
    if (idx !== -1) this.particles.splice(idx, 1);
    this.fireContainer.removeChild(sprite);
    sprite.destroy();

    if (this.running) {
      this.spawnParticle();
    }
  }

  resize(width: number, height: number): void {
    super.resize(width, height);
    this.centerX = width * 0.5;
    this.baseY = height * 0.75;
  }

  exit(): void {
    this.running = false;
    for (const p of this.particles) {
      gsap.killTweensOf(p);
      gsap.killTweensOf(p.scale);
    }
    this.particles = [];
    super.exit();
  }
}
