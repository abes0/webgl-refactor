import * as Saber from "../vendor/saber";
import vs from "../glsl/main.vert?raw";
import fs from "../glsl/main.frag?raw";

export default class CExample {
  sw = 0;
  sh = 0;
  constructor() {
    console.log("CExample");
    this.getSize();
    this.init();
    // this.app.render();
  }
  init() {
    this.app = new Saber.App({
      el: "#canvas",
      sw: this.sw,
      sh: this.sh,
    });
    this.scene = new Saber.Scene();

    this.camera = new Saber.Camera({
      fovy: 45,
      aspect: this.sw / this.sh,
      near: 0.01,
      far: 1000.0,
      pos: [0.0, 0.0, 3.0],
      center: [0.0, 0.0, 0.0],
      upDir: [0.0, 1.0, 0.0],
    });

    this.mesh = this.createMesh();
    this.scene.add(this.mesh);
    this.tick();
  }

  createMesh() {
    const { app } = this;
    const row = 32;
    const column = 32;
    const irad = 0.1;
    const orad = 0.5;
    const color = [1.0, 1.0, 1.0, 1.0];

    // const width = 1.0;
    // const height = 0.5;
    // const color = [1.0, 0.0, 0.0, 1.0];

    const geo = Saber.Geometry.torus(row, column, irad, orad, color);
    // const geo = Saber.Geometry.plane(width, height, color);
    const shader = new Saber.Shader({ app, vs, fs });
    const mesh = new Saber.Mesh({
      app,
      geo,
      shader,
      attribute: {},
      uniform: {},
    });
    return mesh;
  }

  getSize() {
    this.sw = window.innerWidth;
    this.sh = window.innerHeight;
  }

  tick() {
    requestAnimationFrame(() => this.tick());
    const { scene, camera } = this;
    this.app.render(scene, camera);
  }
}
