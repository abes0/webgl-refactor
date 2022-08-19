export class CubeMap {
  constructor(pathArray, option = {}) {
    this.name = "CubeMap";
    console.log(this.name);
    this.pathArray = pathArray;
    this.option = option;
    this.option.slot = this.option.slot ? this.option.slot : 0;
    this.option.slotText = "TEXTURE" + this.option.slot;
  }

  async setup(gl) {
    const targetArray = [
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];

    const prmiseArray = this.pathArray.map((path) => this.load(path));
    const imagesArray = await Promise.all(prmiseArray);
    this.createCubeMap(gl, imagesArray, targetArray);
  }

  load(path) {
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
      img.src = path;
    });
  }

  async createCubeMap(gl, imagesArray, targetArray) {
    const { slot, slotText } = this.option;
    return new Promise((resolve) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl[slotText]);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      targetArray.forEach((item, index) => {
        gl.texImage2D(
          item,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          imagesArray[index]
        );
      });

      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(
        gl.TEXTURE_CUBE_MAP,
        gl.TEXTURE_WRAP_S,
        gl.CLAMP_TO_EDGE
      );
      gl.texParameteri(
        gl.TEXTURE_CUBE_MAP,
        gl.TEXTURE_WRAP_T,
        gl.CLAMP_TO_EDGE
      );
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
      texture.__isCubeMap__ = true;
      texture.__slotText__ = slotText;
      texture.__slot__ = slot;
      this.cubeMapObj = texture;
      resolve();
    });
  }

  getCubeMapObj() {
    return this.cubeMapObj;
  }
}
