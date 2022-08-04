import { MathUtil as M } from "./MathUtil";

export class Camera {
  constructor({ fovy, aspect, near, far, pos, center, upDir }) {
    console.log("Camera");
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.pos = { x: pos[0], y: pos[1], z: pos[2] };
    this.center = { x: center[0], y: center[1], z: center[2] };
    this.upDir = { x: upDir[0], y: upDir[1], z: upDir[2] };
    // this.init();
  }

  init() {
    const m4 = M.Mat4;
    const v3 = M.Vec3;
    this.pos.y = 10.0;
  }

  setupViewMatrix() {
    const pos = M.Vec3.create(this.pos.x, this.y, this.pos.z);
    const center = M.Vec3.create(this.center.x, this.center.y, this.center.z);
    const upDir = M.Vec3.create(this.upDir.x, this.upDir.y, this.upDir.z);

    const v = M.Mat4.lookAt(pos, center, upDir);
    return v;
  }

  setupProjectionMatrix() {
    const { fovy, aspect, near, far } = this;
    const p = M.Mat4.perspective(fovy, aspect, near, far);
    return p;
  }
}
