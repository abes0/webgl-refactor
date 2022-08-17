const WEBGL_COMPONENT_TYPES = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array,
};

const typeHash = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

const WEBGL_TYPE_SIZES = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

export class GLTFLoader {
  constructor(path) {
    this.name = "GLTFLoader";
    console.log(this.name);

    // setup
    this.path = path;
    this.pathWhere = path.substr(0, path.lastIndexOf("/") + 1);

    // request
    this.requestHeader = {};
    this.withCredentials = "same-origin"; // 'include' : 'same-origin'
    this.mimeType = null;
    this.responseType = "arraybuffer";

    // data
    this.container = {};
    this.index = [];
    this.normal = [];
    this.position = [];
  }

  async load() {
    this.data = await this.glTFParser(this.path);

    const primitiveObj = this.data.meshes[0].primitives[0];
    for (const dataKey in primitiveObj) {
      this.setupData(this.data, this.container, dataKey, primitiveObj);
    }

    this.index = await this.getTypeData("indices");
    this.normal = await this.getTypeData("normal");
    this.position = await this.getTypeData("position");
  }

  async getTypeData(type) {
    const target = this.container[type];
    const { buffer, byteOffset, stride, accessor } = target;
    const { componentType, byteOffset: a_byteOffset, count } = accessor;
    const TypedArray = WEBGL_COMPONENT_TYPES[componentType];
    const data = await this.binaryParser(
      this.pathWhere + this.data.buffers[buffer].uri
    );
    const tmp = new TypedArray(data, byteOffset + a_byteOffset, stride * count);
    return tmp;
  }

  getGeomery() {
    return { position: this.position, normal: this.normal, index: this.index };
  }

  setupData(data, container, key, primitiveObj) {
    let targetNumber = primitiveObj[key];
    if (key === "attributes") {
      const target = data.meshes[0].primitives[0].attributes;
      for (const attrKey in target) {
        this.setupData(data, container, attrKey, primitiveObj.attributes);
      }
    } else {
      const accessor = data.accessors[targetNumber];
      let stride = null;
      if (accessor && accessor.type) {
        stride = this.getStride(accessor.type);
        const bufferViewData = data.bufferViews[accessor.bufferView];
        const { byteLength, byteOffset, byteStride, buffer } = bufferViewData;
        container[key.toLowerCase()] = {
          accessor,
          stride,
          byteLength,
          byteOffset,
          buffer,
          byteStride,
        };
      }
    }
  }

  glTFParser(path) {
    return new Promise((resolve) => {
      const req = this.createRequest(path);
      fetch(req).then((res) => {
        res.arrayBuffer().then((buffer) => {
          const array = new Uint8Array(buffer);
          const text = new TextDecoder().decode(array);
          const json = JSON.parse(text);
          resolve(json);
        });
      });
    });
  }

  binaryParser(path) {
    return new Promise((resolve) => {
      const req = this.createRequest(path);
      fetch(req).then((res) => {
        res.arrayBuffer().then((buffer) => {
          resolve(buffer);
        });
      });
    });
  }

  createRequest(path) {
    const req = new Request(path, {
      header: this.requestHeader,
      credential: this.withCredentials,
    });
    return req;
  }

  decodeText(array) {
    let s = "";
    for (let i = 0; i < array.length; i++) {
      s += String.fromCharCode(array[i]);
    }
    return decodeURIComponent(escape(s));
  }

  getStride(typeName) {
    return WEBGL_TYPE_SIZES[typeName];
  }
}
