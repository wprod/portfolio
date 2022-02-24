import Experience from "../Experience";
import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";
import Resources from "../Utils/Resources";
import { Scene } from "three";

export default class World {
  public experience: Experience;
  public scene: Scene;
  public resources: Resources;
  public floor?: Floor;
  public fox?: Fox;
  public environment?: Environment;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) this.fox.update();
  }
}
