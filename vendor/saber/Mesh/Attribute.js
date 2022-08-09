export class Attribute {
  constructor(gl, geo, program, attribute) {
    console.log("Attribute");
    this._setup(gl, geo, program, attribute);
  }

  _setup(gl, geo, program, attribute) {
    const _attr = {
      position: [geo.position, 3],
      normal: [geo.normal, 3],
      color: [geo.color, 4],
      texCoord: [geo.texCoord, 2],
      ...attribute,
    };
    for (const key in _attr) {
      const target = _attr[key];
      const value = target[0];
      const stride = target[1];
      const vbo = this._createVBO(gl, value);
      const location = this._getLocation(gl, program, key);
      this[key] = { location, vbo, value, stride };
    }
    // return _attr;
  }

  _createVBO(gl, vertexArray) {
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

  _getLocation(gl, program, key) {
    return gl.getAttribLocation(program, key);
  }

  _enable(gl) {
    for (const key in this) {
      const { location, vbo, stride } = this[key];
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, stride, gl.FLOAT, false, 0, 0);
    }
  }
}
