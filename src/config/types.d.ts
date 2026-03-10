import BaseScene from "../scenes/BaseScene";
import DemoApp from "../DemoApp";

export type GameConfig = {
  id: string;
  name: string;
  description: string;
  class: new (app: DemoApp, config: GameConfig) => BaseScene;
  data?: Record<string, any>;
};
