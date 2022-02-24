import * as THREE from "three";
import Experience from "../Experience";
import { DirectionalLight, Object3D, Scene } from "three";
import Resources from "../Utils/Resources";
import Debug from "../Utils/Debug";

export default class Environment {
  public experience: Experience;
  public scene: Scene;
  public resources: Resources;
  public debug: Debug;
  public debugFolder: any;
  public sunLight!: DirectionalLight;
  public environmentMap!: {
    intensity: number;
    updateMaterials: () => any;
    texture: any;
  };

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug?.active && this.debug?.ui) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    this.setSunLight();
    this.setEnvironmentMap();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight, "intensity")
        .name("sunLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "x")
        .name("sunLightX")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "y")
        .name("sunLightY")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "z")
        .name("sunLightZ")
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {
      intensity: 0.4,
      texture: this.resources.items.environmentMapTexture,
      updateMaterials: () => {
        this.scene.traverse((child: Object3D) => {
          if (
            child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
          ) {
            child.material.envMap = this.environmentMap.texture;
            child.material.envMapIntensity = this.environmentMap.intensity;
            child.material.needsUpdate = true;
          }
        });
      },
    };

    this.environmentMap.texture.encoding = THREE.sRGBEncoding;
    this.scene.environment = this.environmentMap.texture;
    this.environmentMap.updateMaterials();

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, "intensity")
        .name("envMapIntensity")
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials);
    }
  }
}
