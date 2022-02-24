import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import EventEmitter from "./EventEmitter";
import { CubeTexture, CubeTextureLoader, Texture, TextureLoader } from "three";

export interface ISources {
  name: string;
  type: string;
  paths: string[];
}

export default class Resources extends EventEmitter {
  public sources: ISources[];
  public items: Record<string, Texture | GLTF | CubeTexture>;
  public toLoad: number;
  public loaded: number;
  public loaders!: {
    textureLoader: TextureLoader;
    gltfLoader: GLTFLoader;
    cubeTextureLoader: CubeTextureLoader;
  };

  constructor(sources: ISources[]) {
    super();

    this.sources = sources;
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
    };
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.paths[0], (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.paths[0], (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.paths, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source: ISources, file: Texture | GLTF | CubeTexture) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
