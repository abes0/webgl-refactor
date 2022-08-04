import { MathUtil } from "./MathUtil";
const { Mat4, Vec3 } = MathUtil;

export class Camera {
  constructor({ fovy, near, far, pos, center, upDir }) {
    console.log("Camera");
    this.fovy = fovy;
    this.near = near;
    this.far = far;
    this.pos = { x: pos[0], y: pos[1], z: pos[2] };
    this.center = { x: center[0], y: center[1], z: center[2] };
    this.upDir = { x: upDir[0], y: upDir[1], z: upDir[2] };
  }

  setupViewMatrix() {
    const pos = Vec3.create(this.pos.x, this.y, this.pos.z);
    const center = Vec3.create(this.center.x, this.center.y, this.center.z);
    const upDir = Vec3.create(this.upDir.x, this.upDir.y, this.upDir.z);

    const v = Mat4.lookAt(pos, center, upDir);
    return v;
  }

  setupProjectionMatrix() {
    const { fovy, aspect, near, far } = this;
    const p = Mat4.perspective(fovy, aspect, near, far);
    return p;
  }
}
