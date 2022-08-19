import * as Saber from "../vendor/saber";
import { gsap } from "gsap";

import vs_sphere from "../glsl/slider/sphere.vert?raw";
import fs_sphere from "../glsl/slider/sphere.frag?raw";
import vs_plate from "../glsl/slider/plate.vert?raw";
import fs_plate from "../glsl/slider/plate.frag?raw";
import texDist from "../img/slider/texture03.jpg";
import img01 from "../img/slider/01.jpg";
import img02 from "../img/slider/02.jpg";
import img03 from "../img/slider/03.jpg";

export default class CSlider {
  constructor() {
    console.log("CSlider");
    this.mousePos = { x: 0, y: 0 };
    this.mousePosNow = { x: 0, y: 0 };

    // for eSwipe
    this.isTouch = false;
    this.touchPos = { start: { x: 0, y: 0 } };

    window.addEventListener("selectstart", () => {
      return false;
    });

    this.eTouchstartHandler = this.eTouchstart.bind(this);
    window.addEventListener("touchstart", this.eTouchstartHandler);

    this.eTouchmoveHandler = this.eTouchmove.bind(this);
    window.addEventListener("touchmove", this.eTouchmoveHandler);

    this.eMousemoveHandler = this.eMousemove.bind(this);
    window.addEventListener("mousemove", this.eMousemoveHandler);

    this.eScrollHandler = this.eScroll.bind(this);
    window.addEventListener("wheel", this.eScrollHandler);

    this.isAnimating = false;
    this.current = 0;
    this.animateProgress = 0.00001;
    this.animateProgressSecond = 0.00001;
    this.isNext = true;
    this.isFirst = true;

    this.init();
  }

  async init() {
    this.app = new Saber.App({
      el: "#canvas",
      clearColor: [0.6, 0.6, 0.6, 1],
    });
    this.scene = new Saber.Scene(this.app);
    this.camera = new Saber.Camera();

    this.sphere = this.createSphere();

    this.plate = this.createPlate();

    this.scene.add(this.plate);
    this.scene.add(this.sphere);

    this.tick();
  }

  eMousemove(e) {
    this.setMousePos(e.clientX, e.clientY);
  }

  setMousePos(_x, _y) {
    this.mousePos.x = _x - this.app.sw / 2;
    this.mousePos.y = this.app.sh / 2 - _y;
  }

  eTouchmove(e) {
    const { clientX: _x, clientY: _y } = e.targetTouches[0];
    // console.log({ _x, _y });
    this.setMousePos(_x, _y);
    const diffY = _y - this.touchPos.start.y;
    let direction;
    if (this.isAnimating) return;
    if (diffY < 0) {
      direction = "Down"; // 下へ進む（指を上に動かしたとき）
      this.next();
    } else if (diffY > 0) {
      direction = "Up";
      this.prev();
    }
    console.log(direction);
  }

  eTouchstart(e) {
    this.touchPos.start.x = e.targetTouches[0].clientX;
    this.touchPos.start.y = e.targetTouches[0].clientY;
    console.log(this.touchPos.start);
  }

  eScroll(e) {
    const { deltaY } = e;
    // this.animateProgressSecond = deltaY / 3000;
    let direction;
    const threshold = 0;
    if (this.isAnimating) return;
    // 上下方向
    if (deltaY > threshold) {
      direction = "Down"; // 下へ進む
      // this.isNext = true;
      this.next();
    } else if (deltaY < -threshold) {
      direction = "Up";
      // this.isNext = false;
      this.prev();
    }
  }

  next() {
    const max = 3;
    this.isAnimating = true;
    this.isNext = true;
    this.current = this.current + 1 === max ? 0 : this.current + 1;
    this.animateProgress = 0.01;
    if (this.isFirst) {
      this.isFirst = false;
    }
    const tl = gsap.timeline();
    requestAnimationFrame(() => {
      tl.add([
        // this.aniamteSecondTimeline(),
        gsap.fromTo(
          this,
          {
            animateProgress: 0.0,
          },
          {
            animateProgress: 1.0,
            ease: "power4.out",
            duration: 1.5,
          }
        ),
      ]).call(() => {
        this.isAnimating = false;
      });
    });
  }

  prev() {
    const max = 3;
    this.isAnimating = true;
    this.isNext = false;
    this.current = this.current - 1 === -1 ? max - 1 : this.current - 1;
    this.animateProgress = 0.01;
    const tl = gsap.timeline();
    if (this.isFirst) {
      this.isFirst = false;
    }
    requestAnimationFrame(() => {
      tl.add([
        // this.aniamteSecondTimeline(),
        gsap.fromTo(
          this,
          {
            animateProgress: 0.0,
          },
          {
            animateProgress: 1.0,
            ease: "power4.out",
            duration: 1.5,
          }
        ),
      ]).call(() => {
        this.isAnimating = false;
      });
    });
  }

  aniamteSecondTimeline() {
    const tl = gsap.timeline();
    tl.fromTo(
      this,
      {
        animateProgressSecond: 0.0,
      },
      {
        animateProgressSecond: 0.05,
        ease: "power1.in",
        duration: 0.5,
      }
    ).to(this, {
      animateProgressSecond: 0.0,
      ease: "power1.out",
      duration: 0.25,
    });
    return tl;
  }

  createPlate() {
    const { app } = this;
    const width = 1323; // Math.max(this.app.sw, this.app.sh);
    const height = width;
    const color = [170 / 256, 187 / 256, 238 / 256, 1.0];
    const geo = Saber.Geometry.plane(width, height, color);
    const shader = new Saber.Shader({ app, vs: vs_plate, fs: fs_plate });
    const mesh = new Saber.Mesh({
      app,
      geo,
      shader,
      attribute: {},
      uniform: {
        uTexDist: new Saber.Texture(texDist, {
          slot: 0,
          // wrapS: "MIRRORED_REPEAT",
          // wrapT: "MIRRORED_REPEAT",
        }),
        uTexture0: new Saber.Texture(img01, {
          slot: 1,
          wrapS: "MIRRORED_REPEAT",
          wrapT: "MIRRORED_REPEAT",
        }),
        uTexture1: new Saber.Texture(img02, {
          slot: 2,
          wrapS: "MIRRORED_REPEAT",
          wrapT: "MIRRORED_REPEAT",
        }),
        uTexture2: new Saber.Texture(img03, {
          slot: 3,
          wrapS: "MIRRORED_REPEAT",
          wrapT: "MIRRORED_REPEAT",
        }),
        uIsNext: this.isNext,
        uIsFirst: this.isFirst,
        uIsAnimating: this.isAnimating,
        uAnimateProgress: this.animateProgress,
        uAnimateProgressSecond: this.animateProgressSecond,
        uCurrent: this.current,
        uMousePos: true,
        uTime: true,
      },
    });
    return mesh;
  }

  createSphere() {
    const { app } = this;
    const row = 32;
    const column = 32;
    const size = 60.0;
    const color = [1.0, 1.0, 1.0, 1.0];

    const geo = Saber.Geometry.sphere(row, column, size, color);
    const shader = new Saber.Shader({ app, vs: vs_sphere, fs: fs_sphere });
    const mesh = new Saber.Mesh({
      app,
      geo,
      shader,
      attribute: {},
      uniform: {
        // uTexture0: new Saber.Texture(img01, { slot: 0 }),
        // uTexture1: new Saber.Texture(img02, { slot: 1 }),
        uTextureCube0: new Saber.CubeMap(
          [img01, img01, img01, img01, img01, img01],
          { slot: 3 }
        ),
        uTextureCube1: new Saber.CubeMap(
          [img02, img02, img02, img02, img02, img02],
          { slot: 4 }
        ),
        uTextureCube2: new Saber.CubeMap(
          [img03, img03, img03, img03, img03, img03],
          { slot: 5 }
        ),
        uIsNext: this.isNext,
        uIsFirst: this.isFirst,
        uIsAnimating: this.isAnimating,
        uAnimateProgress: this.animateProgress,
        uCurrent: this.current,
        uMousePos: true,
        uTime: true,
        eyePos: this.camera.getPos(),
        refraction: true,
        refractiveIndex: 1.007,
      },
      cullFace: "BACK",
      depthMask: true,
    });
    return mesh;
  }

  setSlideData() {
    // console.log(this.animateProgressSecond);
    if (this.plate.uniform.uIsNext) {
      this.plate.uniform.uIsNext.value = this.isNext;
    }

    if (this.plate.uniform.uIsFirst) {
      this.plate.uniform.uIsFirst.value = this.isFirst;
    }

    if (this.plate.uniform.uAnimateProgress) {
      this.plate.uniform.uAnimateProgress.value = this.animateProgress;
    }

    if (this.plate.uniform.uAnimateProgressSecond) {
      this.plate.uniform.uAnimateProgressSecond.value =
        this.animateProgressSecond;
    }

    if (this.plate.uniform.uCurrent) {
      this.plate.uniform.uCurrent.value = this.current;
    }

    if (this.sphere.uniform.uIsNext) {
      this.sphere.uniform.uIsNext.value = this.isNext;
    }

    if (this.sphere.uniform.uIsFirst) {
      this.sphere.uniform.uIsFirst.value = this.isFirst;
    }

    if (this.sphere.uniform.uAnimateProgress) {
      this.sphere.uniform.uAnimateProgress.value = this.animateProgress;
    }

    if (this.sphere.uniform.uCurrent) {
      this.sphere.uniform.uCurrent.value = this.current;
    }
  }

  tick() {
    requestAnimationFrame(() => this.tick());

    this.mousePosNow.x += (this.mousePos.x - this.mousePosNow.x) * 0.1;
    this.mousePosNow.y += (this.mousePos.y - this.mousePosNow.y) * 0.1;

    const { scene, camera } = this;
    this.app.render(scene, camera);
    if (this.plate.uniform && this.sphere.uniform) {
      this.sphere.translate.x = this.mousePosNow.x;
      this.sphere.translate.y = this.mousePosNow.y;
      this.setSlideData();
    }
  }
}
