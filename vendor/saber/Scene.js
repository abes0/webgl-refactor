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
    const uniformObject = {
      uTime: nowTime,
    };
    if (this.meshList.length) {
      this.meshList.forEach((mesh) => {
        if (mesh.uniform) {
          mesh.uniform._set(uniformObject);
        }

        mesh.render(gl, v, p);
      });
    }
  }
}
