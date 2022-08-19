export class Texture {
  constructor(path, option = {}) {
    this.name = "Texture";
    console.log(this.name);
    this.path = path;
    this.option = option;
    this.option.slot = this.option.slot ? this.option.slot : 0;
    this.option.slotText = "TEXTURE" + this.option.slot;
    this.option.wrapS = this.option.wrapS ? this.option.wrapS : "CLAMP_TO_EDGE";
    this.option.wrapT = this.option.wrapT ? this.option.wrapT : "CLAMP_TO_EDGE";
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
    const { slot, slotText, wrapS, wrapT } = this.option;
    return new Promise((resolve) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl[slotText]);
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
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrapS]);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrapT]);
      gl.bindTexture(gl.TEXTURE_2D, null);
      texture.__slotText__ = slotText;
      texture.__slot__ = slot;
      this.textureObj = texture;
      resolve();
    });
  }

  getTextureObj() {
    return this.textureObj;
  }
}
