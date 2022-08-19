export class Attribute {
  constructor(gl, geo, program, attribute) {
    console.log("Attribute");
    this._setup(gl, geo, program, attribute);
    // this._setup(gl, geo, program, attribute, geo.name && geo.name === 'GLTFLoader');
  }

  _setup(gl, geo, program, attribute, gltf = false) {
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
      const vbo = this._createVBO(gl, value, key);
      const location = this._getLocation(gl, program, key);
      if (location === -1) continue;
      this[key] = { location, vbo, value, stride };
    }
    // return _attr;
  }

  _createVBO(gl, vertexArray, key) {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // console.log(key, vertexArray);
    const isFloat32Array =
      vertexArray && vertexArray.constructor.name === "Float32Array";
    gl.bufferData(
      gl.ARRAY_BUFFER,
      isFloat32Array ? vertexArray : new Float32Array(vertexArray),
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
