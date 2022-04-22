import * as THREE from "three";
import App from "../App";
import { CircleGeometry, MeshStandardMaterial, Scene, Texture } from "three";
import Resources from "../Utils/Resources";

export default class Floor {
  public app: App;
  public scene: Scene;
  public resources: Resources;
  private geometry!: CircleGeometry;
  public textures!: {
    normal: Texture;
    color: Texture;
  };
  public material!: MeshStandardMaterial;
  public mesh: any;

  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.resources = this.app.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64);
  }

  setTextures() {
    this.textures = {
      color: this.resources.items.grassColorTexture as Texture,
      normal: this.resources.items.grassNormalTexture as Texture,
    };

    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}
