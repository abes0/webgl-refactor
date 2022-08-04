import { MathUtil as M } from "./MathUtil";
import { Utils as U } from "./Utils";

export class Mesh {
  constructor({ app, geo, shader, attribute, uniform }) {
    console.log("Mesh");
    this.app = app;
    this.geo = geo;
    this.shader = shader;
    this.initialAttribute = attribute;
    this.initialUniform = uniform;
    this.init();
  }

  async init() {
    const { app, geo, shader, initialAttribute, initialUniform } = this;
    await shader.init();
    const { gl } = app;
    this.program = this.createProgramObject(
      gl,
      shader.vsObject,
      shader.fsObject
    );
    // IBOを用意した時だけ発火
    if (geo.index) {
      this.ibo = this.createIBO(gl, geo.index);
    }
    // attribute
    this.attribute = this.setupAttribute(
      gl,
      geo,
      this.program,
      initialAttribute
    );
    // uniform
    this.uniform = this.setupUniform(gl, this.program, initialUniform);

    // 一旦
    this.startTime = new Date();
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

  setupAttribute(gl, geo, program, attribute) {
    const _attr = {
      position: [geo.position, 3],
      normal: [geo.normal, 3],
      color: [geo.color, 4],
      ...attribute,
    };
    for (const key in _attr) {
      const target = _attr[key];
      const value = target[0];
      const stride = target[1];
      const vbo = this.createVBO(gl, value);
      const location = this.getLocation(gl, program, key);
      // this.enableAttribute(gl, vbo, location, stride);
      _attr[key] = { location, vbo, value, stride };
    }
    return _attr;
  }

  setupUniform(gl, program, uniform) {
    const _uniform = {
      uTime: 0.0,
      mvpMatrix: new Float32Array([...Array(16).fill(0)]),
      normalInverseMatrix: new Float32Array([...Array(16).fill(0)]),
      ...uniform,
    };
    for (const key in _uniform) {
      const location = gl.getUniformLocation(program, key);
      const value = _uniform[key];
      const method = this.getMethodType(value);
      _uniform[key] = { location, value, method };
    }
    return _uniform;
  }

  // setupAttribute start =============
  createVBO(gl, vertexArray) {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexArray),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
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

  getLocation(gl, program, key) {
    return gl.getAttribLocation(program, key);
  }

  enableAttribute(gl) {
    for (const key in this.attribute) {
      const { location, vbo, stride } = this.attribute[key];
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, stride, gl.FLOAT, false, 0, 0);
    }

    // gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // gl.enableVertexAttribArray(attLocation);
    // gl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0);
  }
  // setupAttribute end ===============

  getMethodType(value) {
    let tmp = "uniform";
    const type = value.constructor.name;
    if (type === "Float32Array") {
      tmp += "Matrix";
      switch (value.length) {
        case 4:
          tmp += "2";
          break;
        case 9:
          tmp += "3";
          break;
        case 16:
          tmp += "4";
          break;
      }
      tmp += "fv";
    } else {
      if (Array.isArray(value)) {
        switch (value.length) {
          case 1:
            tmp += "1";
            break;
          case 2:
            tmp += "2";
            break;
          case 3:
            tmp += "3";
            break;
          case 4:
            tmp += "4";
            break;
        }
        tmp += "fv";
      } else {
        tmp += "1";
        if (U.isInteger) {
          tmp += "i";
        } else if (U.isFloat) {
          tmp += "f";
        }
      }
    }
    return tmp;
  }

  setupModelMatrix() {
    const rotateAxis = M.Vec3.create(0.0, 1.0, 1.0);
    const m = M.Mat4.rotate(
      M.Mat4.identity(),
      this.uniform.uTime.value,
      rotateAxis
    );
    return m;
  }

  setupMVP(m, v, p) {
    const vp = M.Mat4.multiply(p, v);
    const mvp = M.Mat4.multiply(vp, m);
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
    console.log("mesh render");
    if (!this.uniform) return;
    // const nowTime = (new Date() - this.startTime) * 0.001;
    const m = this.setupModelMatrix();
    const mvp = this.setupMVP(m, v, p);
    const normalInverseMatrix = M.Mat4.transpose(M.Mat4.inverse(m));

    this.uniform.normalInverseMatrix.value = normalInverseMatrix;
    this.uniform.mvpMatrix.value = mvp;

    gl.useProgram(this.program);

    Object.keys(this.uniform).forEach((uniformKey) => {
      const { location, value, method } = this.uniform[uniformKey];
      if (method.includes("Matrix")) {
        gl[method](location, false, value);
      } else {
        gl[method](location, value);
      }
    });

    this.enableAttribute(gl);
    if (this.ibo) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

    gl.drawElements(gl.TRIANGLES, this.geo.index.length, gl.UNSIGNED_SHORT, 0);
  }
}
