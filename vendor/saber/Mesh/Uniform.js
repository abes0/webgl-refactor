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
      uMousePos: {
        isActive: false,
        value: [0, 0],
        scale: false,
      },
    };

    this._setup(gl, program, uniform);
  }

  _setup(gl, program, uniform) {
    for (const key in this._defaultPropertyManager) {
      if (uniform.hasOwnProperty(key)) {
        uniform[key];
        const target = this._defaultPropertyManager[key];
        if (typeof uniform[key] === "boolean") {
          target.isActive = uniform[key];
        } else if (typeof uniform[key] === "number") {
          target.isActive = true;
          if (target.scale) {
            target.scale = uniform[key];
          }
        }
        if (target.isActive) {
          uniform[key] = target.value;
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
      const target = this._defaultPropertyManager[key];
      if (target.scale) {
        this[key].value = target.value = uniformObject[key] * target.scale;
      } else {
        this[key].value = target.value = uniformObject[key];
      }
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
  }
}
