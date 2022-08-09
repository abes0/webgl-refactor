import * as Saber from "../vendor/saber";
import vs from "../glsl/main.vert?raw";
import fs from "../glsl/main.frag?raw";

export default class CExample {
  constructor() {
    console.log("CExample");
    this.init();
  }
  init() {
    this.app = new Saber.App({
      el: "#canvas",
      clearColor: [0.6, 0.6, 0.6, 1],
    });
    this.scene = new Saber.Scene(this.app);

    this.camera = new Saber.Camera();

    this.cube = this.createCube();
    this.cube.rotate.axis.x = 1;
    // this.cube.rotate.axis.y = 1;

    this.torus = this.createTorus();
    this.torus.rotate.axis.z = 1;
    this.torus.rotate.axis.y = 1;
    this.torus.translate.x = -250;

    this.sphere = this.createSphere();
    this.sphere.rotate.axis.z = 1;
    this.sphere.rotate.axis.y = 1;
    this.sphere.translate.x = -250;
    // this.sphere.translate.x = -50;
    // this.mesh.rotate.value = 0.5;
    // this.mesh.translate.x = 0.5;

    this.torus02 = this.createTorus();
    this.torus02.rotate.axis.z = 1;
    this.torus02.rotate.axis.y = 1;
    this.torus02.translate.x = 250;

    this.box = this.createBox();
    this.box.rotate.axis.z = 1;
    this.box.rotate.axis.y = 1;
    this.box.translate.x = 250;

    // this.mesh_ = this.createMesh();
    // this.mesh_.rotate.axis.x = 1;
    // this.mesh_.rotate.axis.y = 1;
    // this.mesh_.translate.x = -0.5;
    // this.mesh_.translate.y = -0.5;
    // this.mesh_.scale.x = 1.5;
    // this.mesh_.scale.y = 0.5;

    // this.

    this.scene.add(this.cube);
    this.scene.add(this.torus);
    this.scene.add(this.sphere);
    this.scene.add(this.torus02);
    this.scene.add(this.box);

    // this.scene.add(this.mesh_);

    this.tick();
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
        uTexture0: new Saber.CubeMap([
          "../img/posx.jpg",
          "../img/posy.jpg",
          "../img/posz.jpg",
          "../img/negx.jpg",
          "../img/negy.jpg",
          "../img/negz.jpg",
        ]),
        // uTexture0: new Saber.Texture("../img/sample.jpg"),
        uMousePos: true,
        uTime: true,
        eyePos: this.camera.getPos(),
        refraction: false,
        refractiveIndex: 1.1,
      },
      cullFace: "FRONT",
      depthMask: false,
      isCubeMap: true,
    });
    return mesh;
  }

  createTorus() {
    const { app } = this;
    const row = 32;
    const column = 32;
    const irad = 20;
    const orad = 150;
    const color = [1.0, 1.0, 1.0, 1.0];

    const geo = Saber.Geometry.torus(row, column, irad, orad, color);

    // const geo = Saber.Geometry.plane(500, 500 * (9 / 16), [1, 1, 1, 1]);
    const shader = new Saber.Shader({ app, vs, fs });
    const mesh = new Saber.Mesh({
      app,
      geo,
      shader,
      attribute: {},
      uniform: {
        uTexture0: new Saber.CubeMap([
          "../img/posx.jpg",
          "../img/posy.jpg",
          "../img/posz.jpg",
          "../img/negx.jpg",
          "../img/negy.jpg",
          "../img/negz.jpg",
        ]),
        // uTexture0: new Saber.Texture("../img/sample.jpg"),
        uMousePos: true,
        uTime: true,
        eyePos: this.camera.getPos(),
        refraction: true,
        refractiveIndex: 1.1,
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

    // const geo = Saber.Geometry.plane(500, 500 * (9 / 16), [1, 1, 1, 1]);
    const shader = new Saber.Shader({ app, vs, fs });
    const mesh = new Saber.Mesh({
      app,
      geo,
      shader,
      attribute: {},
      uniform: {
        uTexture0: new Saber.CubeMap([
          "../img/posx.jpg",
          "../img/posy.jpg",
          "../img/posz.jpg",
          "../img/negx.jpg",
          "../img/negy.jpg",
          "../img/negz.jpg",
        ]),
        // uTexture0: new Saber.Texture("../img/sample.jpg"),
        uMousePos: true,
        uTime: true,
        eyePos: this.camera.getPos(),
        refraction: true,
        refractiveIndex: 1.1,
      },
      cullFace: "BACK",
      depthMask: true,
    });
    return mesh;
  }

  createBox() {
    const { app } = this;
    const size = 80.0;
    const color = [1.0, 1.0, 1.0, 1.0];

    const geo = Saber.Geometry.cube(size, color);

    // const geo = Saber.Geometry.plane(500, 500 * (9 / 16), [1, 1, 1, 1]);
    const shader = new Saber.Shader({ app, vs, fs });
    const mesh = new Saber.Mesh({
      app,
      geo,
      shader,
      attribute: {},
      uniform: {
        uTexture0: new Saber.CubeMap([
          "../img/posx.jpg",
          "../img/posy.jpg",
          "../img/posz.jpg",
          "../img/negx.jpg",
          "../img/negy.jpg",
          "../img/negz.jpg",
        ]),
        // uTexture0: new Saber.Texture("../img/sample.jpg"),
        uMousePos: true,
        uTime: true,
        eyePos: this.camera.getPos(),
        refraction: true,
        refractiveIndex: 1.08,
      },
      cullFace: "BACK",
      depthMask: true,
    });
    return mesh;
  }

  tick() {
    requestAnimationFrame(() => this.tick());

    const { scene, camera } = this;
    this.app.render(scene, camera);
    if (this.torus.uniform) {
      this.torus.rotate.value += 0.01;
      this.sphere.rotate.value += 0.01;
      this.torus02.rotate.value += 0.01;
      this.box.rotate.value += 0.01;
      // this.cube.rotate.value += 0.01;
      // this.mesh_.rotate.value -= 0.01;
    }
  }
}
