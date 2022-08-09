import { MathUtil } from "./MathUtil";
import { Uniform } from "./Mesh/Uniform";
import { Attribute } from "./Mesh/Attribute";

const { Mat4, Vec3 } = MathUtil;

export class Mesh {
  constructor({
    app,
    geo,
    shader,
    attribute,
    uniform,
    cullFace = "BACK",
    depthMask = true,
    isCubeMap = false,
  }) {
    console.log("Mesh");
    this.app = app;
    this.geo = geo;
    this.shader = shader;
    this.initialAttribute = attribute;
    this.initialUniform = uniform;
    this.cullFace = cullFace;
    this.depthMask = depthMask;
    this.isCubeMap = isCubeMap;

    this.rotate = {
      axis: { x: 0.0, y: 0.0, z: 0.0 },
      value: 0.0,
    };

    this.scale = { x: 1.0, y: 1.0, z: 1.0 };

    this.translate = { x: 0.0, y: 0.0, z: 0.0 };

    this.init();
  }

  async init() {
    const { app, geo, shader, initialAttribute, initialUniform } = this;
    await shader.init();
    const { gl } = app;

    // program
    this.program = this.createProgramObject(
      gl,
      shader.vsObject,
      shader.fsObject
    );

    // ibo
    if (geo.index) {
      this.ibo = this.createIBO(gl, geo.index);
    }
    // attribute
    this.attribute = new Attribute(gl, geo, this.program, initialAttribute);

    // uniform
    this.uniform = new Uniform(gl, this.program, initialUniform);
  }

  createProgramObject(gl, vsObject, fsObject) {
    const program = gl.createProgram();
    // 関連づけ
    gl.attachShader(program, vsObject);
    gl.attachShader(program, fsObject);

    // アタッチしたものを紐付け
    gl.linkProgram(program);

    // 削除
    gl.deleteShader(vsObject);
    gl.deleteShader(fsObject);

    // 紐付けが成功したか確認
    const isSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (isSuccess) {
      gl.useProgram(program);
      return program;
    } else {
      throw new Error(gl.getProgramInfoLog(program));
    }
  }

  createIBO(gl, indexArray) {
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Int16Array(indexArray),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  }

  setupModelMatrix() {
    let m = Mat4.identity();
    m = this._scale(m);
    m = this._translate(m);
    m = this._rotate(m);

    return m;
  }

  // ==== モデル変換 =========
  _rotate(m) {
    // rotate.axisが全て0だとerrorになるので、回避
    if (
      this.rotate.axis.x !== 0.0 ||
      this.rotate.axis.y !== 0.0 ||
      this.rotate.axis.z !== 0.0
    ) {
      const rotateAxis = Vec3.create(
        this.rotate.axis.x,
        this.rotate.axis.y,
        this.rotate.axis.z
      );
      m = Mat4.rotate(m, this.rotate.value, rotateAxis);
    }
    return m;
  }

  _scale(m) {
    // scaleが全て1だと処理が不要なので、回避
    if (this.scale.x !== 1.0 || this.scale.y !== 1.0 || this.scale.z !== 1.0) {
      const scaleVec = Vec3.create(this.scale.x, this.scale.y, this.scale.z);
      m = Mat4.scale(m, scaleVec);
    }
    return m;
  }

  _translate(m) {
    // translate.vecが全て0だとerrorになるので、回避
    if (
      this.translate.x !== 0.0 ||
      this.translate.y !== 0.0 ||
      this.translate.z !== 0.0
    ) {
      const translateVec = Vec3.create(
        this.translate.x,
        this.translate.y,
        this.translate.z
      );
      m = Mat4.translate(m, translateVec);
    }
    return m;
  }
  // ==== モデル変換 =========

  setupMVP(m, v, p) {
    const vp = Mat4.multiply(p, v);
    const mvp = Mat4.multiply(vp, m);
    return mvp;
  }

  start() {
    this.isRender = true;
  }

  stop() {
    this.isRender = false;
  }

  setDefaultUniform(defaultValue) {
    if (!this.uniform) return;
    for (const key in defaultValue) {
      this.uniform[key].value = defaultValue[key];
    }
  }

  render(gl, v, p) {
    if (!this.uniform || !this.uniform._isSetupFinish) return;
    // const nowTime = (new Date() - this.startTime) * 0.001;
    gl.useProgram(this.program);

    this.attribute._enable(gl);

    // if (this.cullFace === "FRONT") {
    //   gl.enable(gl.CULL_FACE);
    // }
    // if (this.cullFace === "BACK") {
    //   gl.disable(gl.CULL_FACE);
    // }
    gl.cullFace(gl[this.cullFace]);
    gl.depthMask(this.depthMask);

    const m = this.setupModelMatrix();
    const mvp = this.setupMVP(m, v, p);
    const normalInverseMatrix = Mat4.transpose(Mat4.inverse(m));
    if (this.isCubeMap) {
      mvp[12] = 0.0;
      mvp[13] = 0.0;
      mvp[14] = 0.0;
      mvp[15] = 1.0;
    }

    this.uniform.mMatrix.value = m;
    this.uniform.normalInverseMatrix.value = normalInverseMatrix;
    this.uniform.mvpMatrix.value = mvp;

    this.uniform._enable(gl);

    if (this.ibo) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

    gl.drawElements(gl.TRIANGLES, this.geo.index.length, gl.UNSIGNED_SHORT, 0);
  }
}
