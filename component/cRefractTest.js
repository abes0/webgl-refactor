import * as Saber from "../vendor/saber";
import vs from "../glsl/refract/main.vert?raw";
import fs from "../glsl/refract/main.frag?raw";
import sampleImg from "../img/sample.jpg";
import imgPosX from "../img/posx.jpg";
import imgPosY from "../img/posy.jpg";
import imgPosZ from "../img/posz.jpg";
import imgNegX from "../img/negx.jpg";
import imgNegY from "../img/negy.jpg";
import imgNegZ from "../img/negz.jpg";
import gltfDuck_url from "../gltf/Duck.gltf?url";
import gltfDuck_bin from "../gltf/Duck_data.bin?url";

export default class CRefractTest {
  constructor() {
    console.log("CRefract");
    this.mousePos = { x: 0, y: 0 };
    this.mousePosNow = { x: 0, y: 0 };
    this.eMousemoveHandler = this.eMousemove.bind(this);
    window.addEventListener("mousemove", this.eMousemoveHandler);
    this.init();
  }
  async init() {
    this.app = new Saber.App({
      el: "#canvas",
      clearColor: [0.6, 0.6, 0.6, 1],
    });
    this.scene = new Saber.Scene(this.app);

    this.camera = new Saber.Camera();

    this.cube = this.createCube();
    // this.cube.rotate.axis.y = 1;
    // this.cube.rotate.axis.y = 1;

    // this.duck = await this.createGltf();
    this.duck = this.createSphere();
    this.duck.rotate.axis.z = 0.3;
    this.duck.rotate.axis.x = 0.3;
    this.duck.rotate.axis.y = 1;
    this.duck.translate.y = -50;

    this.scene.add(this.cube);
    this.scene.add(this.duck);

    // this.scene.add(this.mesh_);

    this.tick();
  }
  eMousemove(e) {
    console.log(this.app.sw, this.app.sw - e.clientX / 2);
    this.mousePos.x = e.clientX - this.app.sw / 2;
    this.mousePos.y = this.app.sh / 2 - e.clientY;
  }

  createCube() {
    const { app } = this;

    const geo = Saber.Geometry.cube(450, [1, 1, 1, 1]);
    const shader = new Saber.Shader({ app, vs, fs });
    const mesh = new Saber.Mesh({
      app,
      geo,
      shader,
      attribute: {},
      uniform: {
        uTexture0: new Saber.CubeMap(
          [sampleImg, sampleImg, sampleImg, sampleImg, sampleImg, sampleImg],
          { slot: 0 }
        ),
        uTexture1: new Saber.CubeMap(
          [imgPosX, imgPosY, imgPosZ, imgNegX, imgNegY, imgNegZ],
          { slot: 1 }
        ),
        // uTexture0: new Saber.Texture("../img/sample.jpg"),
        uMousePos: true,
        uTime: true,
        eyePos: this.camera.getPos(),
        refraction: false,
        refractiveIndex: 1.01,
      },
      cullFace: "FRONT",
      depthMask: false,
      isCubeMap: true,
    });
    return mesh;
  }

  async createGltf() {
    const { app } = this;
    const gltf = new Saber.GLTFLoader(gltfDuck_url);
    await gltf.load();
    const geo = gltf.getGeomery();

    const shader = new Saber.Shader({ app, vs, fs });
    const mesh = new Saber.Mesh({
      app,
      geo,
      shader,
      attribute: {},
      uniform: {
        uTexture0: new Saber.CubeMap(
          [sampleImg, sampleImg, sampleImg, sampleImg, sampleImg, sampleImg],
          { slot: 0 }
        ),
        uTexture1: new Saber.CubeMap(
          [imgPosX, imgPosY, imgPosZ, imgNegX, imgNegY, imgNegZ],
          { slot: 1 }
        ),
        // uTexture0: new Saber.Texture("../img/sample.jpg"),
        uMousePos: true,
        uTime: true,
        eyePos: this.camera.getPos(),
        refraction: true,
        refractiveIndex: 1.02,
      },
      cullFace: "BACK",
      depthMask: true,
    });
    return mesh;
  }

  createSphere() {
    const { app } = this;
    const row = 32;
    const column = 32;
    const size = 60.0;
    const color = [1.0, 1.0, 1.0, 1.0];

    const geo = Saber.Geometry.sphere(row, column, size, color);

    const shader = new Saber.Shader({ app, vs, fs });
    const mesh = new Saber.Mesh({
      app,
      geo,
      shader,
      attribute: {},
      uniform: {
        uTexture0: new Saber.CubeMap(
          [sampleImg, sampleImg, sampleImg, sampleImg, sampleImg, sampleImg],
          { slot: 0 }
        ),
        uTexture1: new Saber.CubeMap(
          [imgPosX, imgPosY, imgPosZ, imgNegX, imgNegY, imgNegZ],
          { slot: 1 }
        ),
        // uTexture0: new Saber.Texture("../img/sample.jpg"),
        uMousePos: true,
        uTime: true,
        eyePos: this.camera.getPos(),
        refraction: true,
        refractiveIndex: 1.09,
      },
      cullFace: "BACK",
      depthMask: true,
    });
    return mesh;
  }

  tick() {
    requestAnimationFrame(() => this.tick());

    this.mousePosNow.x += (this.mousePos.x - this.mousePosNow.x) * 0.1;
    this.mousePosNow.y += (this.mousePos.y - this.mousePosNow.y) * 0.1;

    const { scene, camera } = this;
    this.app.render(scene, camera);
    if (this.duck.uniform) {
      this.duck.rotate.value += 0.01;
      this.duck.translate.x = this.mousePosNow.x;
      this.duck.translate.y = this.mousePosNow.y;
    }
  }
}
