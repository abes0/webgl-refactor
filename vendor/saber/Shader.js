export class Shader {
  constructor({ app, vs, fs }) {
    console.log("Shader");
    this.app = app;
    this.vs = vs;
    this.fs = fs;
  }

  async init() {
    const { app, vs, fs } = this;
    const { gl } = app;
    if (gl === null) {
      throw new Error("not initialized");
    } else {
      const [vsObject, fsObject] = await Promise.all([
        this.loadShader(vs),
        this.loadShader(fs),
      ]);
      this.vsObject = vsObject;
      this.fsObject = fsObject;
    }
  }

  loadShader(source) {
    const { gl } = this.app;
    return new Promise((resolve, reject) => {
      const isPath = /\.(glsl|frag|vert)$/.test(source);
      if (isPath) {
        fetch(source)
          .then((res) => {
            const text = res.text();
            resolve(text);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        const type = source.includes("gl_Position")
          ? gl.VERTEX_SHADER
          : source.includes("gl_FragColor")
          ? gl.FRAGMENT_SHADER
          : null;
        if (gl === null && type === null) {
          throw new Error("not get shader type");
        }
        resolve({ source, type });
      }
    }).then(({ source, type }) => {
      return this.createShaderObject(source, type);
    });
  }

  createShaderObject(source, type) {
    const { gl } = this.app;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const isSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (isSuccess) {
      return shader;
    } else {
      throw new Error(gl.getShaderInfoLog(shader));
    }
  }
}
