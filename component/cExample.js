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

    this.mesh = this.createMesh();
    this.mesh.rotate.axis.z = 1;
    this.mesh.rotate.axis.y = 1;
    this.mesh.rotate.value = 0.5;
    this.mesh.translate.x = 0.5;

    // this.mesh_ = this.createMesh();
    // this.mesh_.rotate.axis.x = 1;
    // this.mesh_.rotate.axis.y = 1;
    // this.mesh_.translate.x = -0.5;
    // this.mesh_.translate.y = -0.5;
    // this.mesh_.scale.x = 1.5;
    // this.mesh_.scale.y = 0.5;

    this.scene.add(this.mesh);
    // this.scene.add(this.mesh_);

    this.tick();
  }

  createMesh() {
    const { app } = this;
    const row = 32;
    const column = 32;
    const irad = 10;
    const orad = 200;
    const color = [1.0, 1.0, 1.0, 1.0];

    // const geo = Saber.Geometry.torus(row, column, irad, orad, color);

    const geo = Saber.Geometry.plane(500, 500 * (9 / 16), [1, 1, 1, 1]);
    const shader = new Saber.Shader({ app, vs, fs });
    const mesh = new Saber.Mesh({
      app,
      geo,
      shader,
      attribute: {},
      uniform: {
        uTexture0: new Saber.Texture("../img/sample.jpg"),
        uMousePos: true,
        uTime: true,
      },
    });
    return mesh;
  }

  tick() {
    requestAnimationFrame(() => this.tick());

    const { scene, camera } = this;
    this.app.render(scene, camera);
    if (this.mesh.uniform) {
      this.mesh.rotate.value += 0.01;
      // this.mesh_.rotate.value -= 0.01;
    }
  }
}
