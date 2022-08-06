export class Scene {
  meshList = [];
  constructor(app) {
    console.log("Scene");
    this.app = app;
    // console.log(this.app.sw);

    // uMousePos
    this.mousePos = { x: 0, y: 0 };
    this.eMousemoveHandler = this.eMousemove.bind(this);
    window.addEventListener("mousemove", this.eMousemoveHandler);

    // uTime
    this.startTime = new Date();
  }

  add(mesh) {
    this.meshList.push(mesh);
  }

  eMousemove(e) {
    this.mousePos.x = (e.clientX / this.app.sw) * 2 - 1;
    this.mousePos.y = 1 - (e.clientY / this.app.sh) * 2;
  }

  render(gl, v, p) {
    const nowTime = (new Date() - this.startTime) * 0.001;
    const uniformObject = {
      uMousePos: [this.mousePos.x, this.mousePos.y],
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
