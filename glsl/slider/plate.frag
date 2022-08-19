precision mediump float;

// varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

// 経過時間を uniform 変数として受け取る
uniform mat4 normalInverseMatrix;
uniform float uTime;
// uniform vec2 uMousePos;
uniform sampler2D uTexDist;
uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform bool refraction;
uniform float refractiveIndex;
uniform vec3 eyePos;
uniform bool uIsNext;
uniform bool uIsFirst;
uniform bool uIsAnimating;
uniform float uAnimateProgress;
uniform float uAnimateProgressSecond;
uniform int uCurrent;


// vec3 light = vec3(1.0, 1.0, 1.0);
// float dotScale = 0.5;

const float PI = 3.1415926;
const float effectRatio = 0.12;

vec2 fitCover(vec2 coord, vec2 inputResolution, vec2 outputResolution) {
  vec2 ratio = vec2(
    min((outputResolution.x / outputResolution.y) / (inputResolution.x / inputResolution.y), 1.0),
    min((outputResolution.y / outputResolution.x) / (inputResolution.y / inputResolution.x), 1.0)
  );
  return coord * ratio + (1. - ratio) * 0.5;
}

void discardOutOfRangeUv(vec2 uv) {
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) discard;
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec4 slideChange(sampler2D beforeImg, sampler2D afterImg, vec2 uv, float mixRatio, vec4 texDist, bool _uIsNext) {
  vec2 imageUv01;
  vec2 imageUv02;
  if(_uIsNext) {
    imageUv01 = vec2(uv.x, uv.y + mixRatio * (texDist.r * effectRatio));
    imageUv02 = vec2(uv.x, uv.y - (1. - mixRatio) * (texDist.r * effectRatio));
  } else {
    imageUv01 = vec2(uv.x, uv.y + mixRatio * (texDist.r * effectRatio));
    imageUv02 = vec2(uv.x, uv.y + (1. - mixRatio) * (texDist.r * effectRatio));
  }

  vec4 image01 = texture2D(beforeImg, imageUv01);
  vec4 image02 = texture2D(afterImg, imageUv02);

  vec4 mixImage = mix(image01, image02, mixRatio);
  return mixImage;
}

void main(){
  // vec3 n = (normalInverseMatrix * vec4(vNormal, 0.0)).xyz;
  // float d = dot(normalize(n), normalize(light));
  // vec4 texture = textureCube(uTexture0, vNormal);
  // vec4 color = vec4(sin(uTime) + uMousePos.y, vColor.g + uMousePos.x, vColor.b * d, vColor.a);
  // vec4 color = vec4(vPosition.xyz / 50., 1.0);
  // vec4 color = vec4(vColor.xyz * d, 1.);
  // vec4 color = vec4(vColor.xyz, 1.0);
  // vec4 color = vec4(texture.xyz * d, texture.w);
  // gl_FragColor = texture;
  // gl_FragColor = envColor;
  // gl_FragColor = vec4(170. / 256., 187. / 256., 238. / 256., 1.);

  vec2 uv = vUv;
  // uv.y = 1.0 - uv.y;
  uv.x = 1.0 - uv.x;

  uv -= 0.5;
  uv.x /= 1. - uv.y * PI * (uAnimateProgressSecond);
  uv += 0.5;

  uv.y += sin(uv.x * PI) * (uAnimateProgressSecond);


  float mixRatio = uAnimateProgress;
  // float mixRatio = map(sin(uTime), -1.0, 1.0, 0.0, 1.0);
  
  // vec2 uImageResolution = vec2(1., 1.);
  // uv = fitCover(uv, uImageResolution, uResolutionModel)
  // vec4 texture = texture2D(uTexture0, uv);
  // vec2 imageUv = vec2(uv.x, uv.y + te)
  vec2 texDistUv = uv * 2.;
  vec4 texDist = texture2D(uTexDist, uv);

  vec4 mixImage;

  if(uIsFirst) {
    mixImage = texture2D(uTexture0, uv);
  } else {
    if(uIsNext) {
      if ( uCurrent == 0) {
        mixImage = slideChange(uTexture2, uTexture0, uv, mixRatio, texDist, uIsNext);
      } else if(uCurrent == 1) {
        mixImage = slideChange(uTexture0, uTexture1, uv, mixRatio, texDist, uIsNext);

      }else if(uCurrent == 2) {
        mixImage = slideChange(uTexture1, uTexture2, uv, mixRatio, texDist, uIsNext);
      }
    } else {
      if ( uCurrent == 0) {
        mixImage = slideChange(uTexture1, uTexture0, uv, mixRatio, texDist, uIsNext);
      } else if(uCurrent == 1) {
        mixImage = slideChange(uTexture2, uTexture1, uv, mixRatio, texDist, uIsNext);

      }else if(uCurrent == 2) {
        mixImage = slideChange(uTexture0, uTexture2, uv, mixRatio, texDist, uIsNext);
      }
    }
  }
  discardOutOfRangeUv(uv);

  gl_FragColor = mixImage;
}

