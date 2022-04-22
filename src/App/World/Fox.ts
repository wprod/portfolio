import * as THREE from "three";
import App from "../App";
import { Group, Scene } from "three";
import Resources from "../Utils/Resources";
import Time from "../Utils/Time";
import Debug from "../Utils/Debug";
import { GUI } from "lil-gui";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default class Fox {
  public app: App;
  public scene: Scene;
  public resources: Resources;
  public time: Time;
  public debug: Debug;
  public debugFolder?: GUI;
  public resource: GLTF;
  public model?: Group;
  public animation: any;

  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.resources = this.app.resources;
    this.time = this.app.time;
    this.debug = this.app.debug;

    // Debug
    if (this.debug.active && this.debug.ui) {
      this.debugFolder = this.debug.ui.addFolder("fox");
    }

    // Resource
    this.resource = this.resources.items.foxModel as GLTF;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    if (!this.model) {
      return;
    }

    this.animation = {};

    // Mixer
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    // Actions
    this.animation.actions = {};

    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0]
    );
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1]
    );
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2]
    );

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    // Play the action
    this.animation.play = (name: string) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    };

    // Debug
    if (this.debug.active && this.debugFolder) {
      const debugObject = {
        playIdle: () => {
          this.animation.play("idle");
        },
        playWalking: () => {
          this.animation.play("walking");
        },
        playRunning: () => {
          this.animation.play("running");
        },
      };
      this.debugFolder.add(debugObject, "playIdle");
      this.debugFolder.add(debugObject, "playWalking");
      this.debugFolder.add(debugObject, "playRunning");
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}
