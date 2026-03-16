import AceOfShadowsScene from "../scenes/AceOfShadowsScene";
import MagicWordsScene from "../scenes/MagicWordsScene";
import PhoenixFlameScene from "../scenes/PhoenixFlameScene";
import { GameConfig } from "./types";

export const AVAILABLE_GAMES = [
  {
    id: "aceOfShadows",
    name: "Ace of Shadows",
    description: `Create 144 sprites (NOT graphic objects) that are stacked on top of each other like cards in a deck. The top card must cover the bottom card, but not completely. Every 1 second the top card should move to a different stack - the animation of the movement should take 2 seconds.`,
    class: AceOfShadowsScene,
    data: {
      CARDS_AMOUNT: 144,
      STACKS_AMOUNT: 5,
      CARDS_SCALE: 1.2,
      STACK_RADIUS_RATIO: 0.3,
    },
  },
  {
    id: "magicWords",
    name: "Magic Words",
    description: `Create a system that allows you to combine text and images like custom emojis. Use it to render a dialogue between characters with the data taken from this endpoint:`,
    class: MagicWordsScene,
    data: {
      API_URL:
        "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords",

      SCREEN_OFFSET_X: 6,
      SCREEN_OFFSET_Y: -104,
      SCREEN_WIDTH: 158,
      SCREEN_HEIGHT: 156,
    },
  },
  {
    id: "phoenixFlame",
    name: "Phoenix Flame",
    description: `Make a particle-effect demo showing a great fire effect. Keep the number of images at max 10 sprites on the screen at the same time.`,
    class: PhoenixFlameScene,
    data: {
      MAX_PARTICLES: 10,
      FIRE_FRAMES: ["fire-1.png", "fire-2.png", "fire-3.png"],
    },
  },
] as GameConfig[];
