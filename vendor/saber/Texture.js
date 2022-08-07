export class Texture {
  constructor(path, option = {}) {
    console.log("Texture");
    this.path = path;
  }

  async setup(gl) {
    await this.load();
    this.createTexture(gl);
  }

  load() {
    return new Promise((resolve) => {
      const img = new Image();
      img.addEventListener(
        "load",
        () => {
          this.img = img;
          resolve(img);
        },
        false
      );
      img.src = this.path;
    });
  }

  createTexture(gl) {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.img
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.textureObj = texture;
  }

  getTextureObj() {
    return this.textureObj;
  }
}
