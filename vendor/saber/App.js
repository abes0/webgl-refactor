export class App {
  el = null;
  sw = 0;
  sh = 0;
  gl = null;

  constructor({ el, sw, sh, clearColor = [0.0, 0.0, 0.0, 1.0] }) {
    console.log("App");
    // this.params = params;
    this.el = el;
    this.sw = sw;
    this.sh = sh;
    this.clearColor = clearColor;
    this.init();
  }

  async init() {
    this.el = this.getRoot(this.el);
    this.gl = this.getContext();
    // window.Saber = window.Saber || this;
    this.setSize(this.sw, this.sh);
  }

  getRoot(el) {
    const type = typeof el;
    switch (type) {
      case "string":
        return document.querySelector(el);
      case "object":
        return el;
      default:
        throw new Error("Can't root element.");
    }
  }

  getContext() {
    const gl = this.el.getContext("webgl");
    if (gl === null) {
      throw new Error("webgl not supported");
    } else {
      return gl;
    }
  }

  setSize(w, h) {
    let { sw, sh } = this;
    this.el.width = sw = w;
    this.el.height = sh = h;
  }

  setupRendering() {
    const { sw, sh } = this;
    const { gl } = this;
    gl.viewport(0, 0, sw, sh);
    gl.clearColor(
      this.clearColor[0],
      this.clearColor[1],
      this.clearColor[2],
      this.clearColor[3]
    );
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.CULL_FACE);
    // gl.cullFace(gl.BACK_AND_FRONT);
    gl.enable(gl.DEPTH_TEST);
  }

  render(scene, camera) {
    // rendering setup
    this.setupRendering();

    const v = camera.setupViewMatrix();
    const p = camera.setupProjectionMatrix();

    scene.render(this.gl, v, p);
  }
}
