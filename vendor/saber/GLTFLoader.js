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
  constructor(path, binPath) {
    this.name = "GLTFLoader";
    console.log(this.name);
    this.path = path;
    this.binPath = binPath;
    this.pathWhere = path.substr(0, path.lastIndexOf("/") + 1);
    console.log(this.pathWhere);
    this.requestHeader = {};
    this.withCredentials = "same-origin"; // 'include' : 'same-origin'
    this.mimeType = null;
    this.responseType = "arraybuffer";
    this.container = {};

    this.position = [];
    this.normal = [];
  }

  async load() {
    const data = await this.glTFParser(this.path);
    // const bufferURI = data.buffers[0].uri;
    console.log(data);
    const b = await this.binaryParser(this.binPath);
    // const b = await this.loadFile(this.pathWhere + bufferURI);
    console.log(b);
    const primitiveObj = data.meshes[0].primitives[0];
    for (const dataKey in primitiveObj) {
      this.setupParse(data, this.container, dataKey, primitiveObj);
    }
    this.indicesUri = data.buffers[this.container.indices.buffer];
    this.positionUri = data.buffers[this.container.position.buffer];

    this.index = new Uint16Array(
      b,
      this.container.indices.accessor.byteOffset,
      this.container.indices.stride * this.container.indices.accessor.count
    );
    console.log(this.index);

    this.position = new Float32Array(
      b,
      this.container.position.accessor.byteOffset,
      this.container.position.stride * this.container.position.accessor.count
    );

    this.normal = new Float32Array(
      b,
      this.container.normal.accessor.byteOffset,
      this.container.normal.stride * this.container.normal.accessor.count
    );

    console.log(this.container);
  }

  getMoldData() {
    return { position: this.position, normal: this.normal, index: this.index };
  }

  setupParse(data, container, key, primitiveObj) {
    let targetNumber = primitiveObj[key];
    if (key === "attributes") {
      const target = data.meshes[0].primitives[0].attributes;
      for (const attrKey in target) {
        this.setupParse(data, container, attrKey, primitiveObj.attributes);
      }
    } else {
      const accessor = data.accessors[targetNumber];
      let stride = null;
      // console.log(key, targetNumber, accessor);
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
          // return json;
        });
      });
    });
  }

  binaryParser(path) {
    return new Promise((resolve) => {
      const req = this.createRequest(path);
      fetch(req).then((res) => {
        res.arrayBuffer().then((buffer) => {
          const array = new Uint8Array(buffer);
          // const text = new TextDecoder().decode(array);
          // const b64 = btoa(encodeURIComponent(text));
          // ====
          // const b64 = atob(buffer);
          // const arrayBuffer = new ArrayBuffer(b64.length);
          // const intArray = new Uint8Array(arrayBuffer);
          // console.log(buffer);
          // resolve(b64);
          resolve(buffer);
        });
      });
    });
  }

  loadFile(path) {
    return new Promise((resolve) => {
      const req = this.createRequest(path);
      fetch(req).then((res) => {
        res.arrayBuffer().then((buffer) => {
          console.log(new Blob([buffer], { type: "json" }));
          const array = new Uint8Array(buffer);
          const text = new TextDecoder("sjis").decode(array);
          console.log(text);
          const json = JSON.parse(text);
          resolve(json);
          // console.log(json.buffers[0].uri);
          // const reader = new FileReader();
          // reader.readAsText(json.buffers[0].uri);
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

  async createReadStream(res) {
    if (res.body) {
      const reader = await res.body.getReader();
      // const contentLength = res.headers.get("Content-Length");
      // const total = contentLength ? parseInt(contentLength) : 0;
      // const lengthComputable = total !== 0;
      // let loaded = 0;
      // const stream = new ReadableStream({});
      console.log(reader);
    }
  }

  decodeText(array) {
    let s = "";
    for (let i = 0; i < array.length; i++) {
      s += String.fromCharCode(array[i]);
    }
    return decodeURIComponent(escape(s));
  }

  getStride(typeName) {
    return typeHash[typeName];
  }
}
