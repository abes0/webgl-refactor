import { Utils as U } from "../Utils";
export class Uniform {
  constructor(gl, program, uniform) {
    console.log("Uniform");

    this._defaultPropertyManager = {
      uTime: {
        isActive: false,
        value: 0.0,
        scale: 1.0,
      },
    };

    this._setup(gl, program, uniform);
  }

  _setup(gl, program, uniform) {
    for (const key in this._defaultPropertyManager) {
      if (uniform.hasOwnProperty(key)) {
        if (typeof uniform[key] === "boolean") {
          this._defaultPropertyManager[key].isActive = uniform[key];
        } else if (typeof uniform[key] === "number") {
          this._defaultPropertyManager[key].isActive = true;
          this._defaultPropertyManager[key].scale = uniform[key];
        }
        if (this._defaultPropertyManager[key].isActive) {
          uniform[key] = this._defaultPropertyManager[key].value;
        } else {
          delete uniform[key];
        }
      }
    }
    const _uniform = {
      mvpMatrix: new Float32Array([...Array(16).fill(0)]),
      normalInverseMatrix: new Float32Array([...Array(16).fill(0)]),
      ...uniform,
    };

    for (const key in _uniform) {
      const location = gl.getUniformLocation(program, key);
      const value = _uniform[key];
      const method = this._getMethodType(value);
      this[key] = { location, value, method };
    }
  }

  _getMethodType(value) {
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

  _set(uniformObject) {
    for (const key in uniformObject) {
      if (!this.hasOwnProperty(key)) return;
      this[key].value = this._defaultPropertyManager[key].value =
        uniformObject[key] * this._defaultPropertyManager[key].scale;
    }
  }

  _enable(gl) {
    Object.keys(this).forEach((key) => {
      if (key.charAt(0) === "_") return;
      const { location, value, method } = this[key];
      if (method.includes("Matrix")) {
        gl[method](location, false, value);
      } else {
        gl[method](location, value);
      }
    });
    console.log(this._defaultPropertyManager);
  }
}
