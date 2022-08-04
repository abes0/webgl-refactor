import { Utils as U } from "../Utils";
export class Uniform {
  constructor(gl, program, uniform) {
    console.log("Uniform");
    // this.gl = gl
    // this.program = program
    // this.uniform = uniform
    this._setup(gl, program, uniform);
  }
  _setup(gl, program, uniform) {
    const _uniform = {
      uTime: 0.0,
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
    // return _uniform;
    // console.log(this);
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

  _enable(gl) {
    Object.keys(this).forEach((key) => {
      const { location, value, method } = this[key];
      if (method.includes("Matrix")) {
        gl[method](location, false, value);
      } else {
        gl[method](location, value);
      }
    });
  }
}
