export class Scene {
  meshList = [];
  constructor() {
    console.log("Scene");
    this.startTime = new Date();
  }
  add(mesh) {
    this.meshList.push(mesh);
  }
  render(gl, v, p) {
    const nowTime = (new Date() - this.startTime) * 0.001;
    const defaultUniform = {
      uTime: nowTime,
    };
    if (this.meshList.length) {
      this.meshList.forEach((mesh) => {
        mesh.setDefaultUniform(defaultUniform);
        mesh.render(gl, v, p);
      });
    }
  }
}
