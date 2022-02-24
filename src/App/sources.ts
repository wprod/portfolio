export default [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    paths: [
      "textures/environmentMap/px.jpg",
      "textures/environmentMap/nx.jpg",
      "textures/environmentMap/py.jpg",
      "textures/environmentMap/ny.jpg",
      "textures/environmentMap/pz.jpg",
      "textures/environmentMap/nz.jpg",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    paths: ["textures/dirt/color.jpg"],
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    paths: ["textures/dirt/normal.jpg"],
  },
  {
    name: "foxModel",
    type: "gltfModel",
    paths: ["models/Fox/glTF/Fox.gltf"],
  },
];
