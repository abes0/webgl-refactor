export class App {
  el = null;
  sw = 0;
  sh = 0;
  gl = null;

  constructor({ el, clearColor = [0.0, 0.0, 0.0, 0.0] }) {
    console.log("App");
    this.el = el;
    this.clearColor = clearColor;
    this.init();
  }

  async init() {
    this.el = this.getRoot(this.el);
    this.gl = this.getContext();
    // window.Saber = window.Saber || this;

    // resize
    this.eResize();
    this.eResizeHandler = this.eResize.bind(this);
    window.addEventListener("resize", this.eResizeHandler);
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

  eResize() {
    this.getSize();
    this.setSize();
  }

  getSize() {
    this.sw = window.innerWidth;
    this.sh = window.innerHeight;
  }

  setSize() {
    const { sw, sh } = this;
    this.el.width = sw;
    this.el.height = sh;
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

    camera.aspect = this.sw / this.sh;
    const v = camera.setupViewMatrix();
    const p = camera.setupProjectionMatrix();

    scene.render(this.gl, v, p);
  }
}
