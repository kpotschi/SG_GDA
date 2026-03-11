import AceOfShadowsScene from "../scenes/AceOfShadowsScene";
import MagicWordsScene from "../scenes/MagicWordsScene";
import PhoenixFlameScene from "../scenes/PhoenixFlameScene";
import { GameConfig } from "./types";

export const CONSTANTS = {
  AVAILABLE_GAMES: [
    {
      id: "aceOfShadows",
      name: "Ace of Shadows",
      description: `Create 144 sprites (NOT graphic objects) that are stacked on top of each other like cards in a deck. The top card must cover the bottom card, but not completely. Every 1 second the top card should move to a different stack - the animation of the movement should take 2 seconds.`,
      class: AceOfShadowsScene,
      data: {
        CARDS_AMOUNT: 144,
        STACKS_AMOUNT: 4,
        STACK_RADIUS_RATIO: 0.2,
        STACK_CENTER_Y_RATIO: 0.56,
        CARD_STACK_OFFSET_X: 0.18,
        CARD_STACK_OFFSET_Y: 0.6,
      },
    },
    {
      id: "magicWords",
      name: "Magic Words",
      description: `Create a system that allows you to combine text and images like custom emojis. Use it to render a dialogue between characters with the data taken from this endpoint:`,
      class: MagicWordsScene,
    },
    {
      id: "phoenixFlame",
      name: "Phoenix Flame",
      description: `Make a particle-effect demo showing a great fire effect. Keep the number of images at max 10 sprites on the screen at the same time.`,
      class: PhoenixFlameScene,
    },
  ] as GameConfig[],
};
