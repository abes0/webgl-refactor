precision mediump float;

// varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

// 経過時間を uniform 変数として受け取る
uniform mat4 normalInverseMatrix;
uniform float uTime;
// uniform vec2 uMousePos;
uniform samplerCube uTextureCube0;
uniform samplerCube uTextureCube1;
uniform samplerCube uTextureCube2;
// uniform sampler2D uTexture0;
uniform bool refraction;
uniform float refractiveIndex;
uniform vec3 eyePos;
uniform bool uIsNext;
uniform bool uIsFirst;
uniform bool uIsAnimating;
uniform float uAnimateProgress;
uniform int uCurrent;

// vec3 light = vec3(1.0, 1.0, 1.0);
// float dotScale = 0.5;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec4 slideChange(samplerCube beforeCube, samplerCube afterCube, vec3 refractVec, float mixRatio) {
  vec4 before = textureCube(beforeCube, refractVec);
  vec4 after = textureCube(afterCube, refractVec);
  return mix(before, after, mixRatio);
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
  float mixRatio = uAnimateProgress;
  // float mixRatio = map(sin(uTime), -1.0, 1.0, 0.0, 1.0);
  vec3 eyeDir = normalize(vPosition - eyePos);
  vec3 normal = normalize(vNormal);
  vec3 refractVec = normal;

  if(refraction == true) {
    float eta = 1.0 / refractiveIndex;
    refractVec = refract(eyeDir, normal, eta);
  }

  // vec4 envColor = textureCube(uTextureCube0, refractVec);
  // vec4 envColor_ = textureCube(uTextureCube1, refractVec);
  // gl_FragColor = mix(envColor, envColor_, mixRatio);
  vec4 envColor;

  if(uIsFirst) {
    envColor = textureCube(uTextureCube0, refractVec);
  } else {
    if(uIsNext) {
      if ( uCurrent == 0) {
        envColor = slideChange(uTextureCube2, uTextureCube0, refractVec, mixRatio);
      } else if(uCurrent == 1) {
        envColor = slideChange(uTextureCube0, uTextureCube1, refractVec, mixRatio);
      }else if(uCurrent == 2) {
        envColor = slideChange(uTextureCube1, uTextureCube2, refractVec, mixRatio);
      }
    } else {
      if ( uCurrent == 0) {
        envColor = slideChange(uTextureCube1, uTextureCube0, refractVec, mixRatio);
      } else if(uCurrent == 1) {
        envColor = slideChange(uTextureCube2, uTextureCube1, refractVec, mixRatio);
      }else if(uCurrent == 2) {
        envColor = slideChange(uTextureCube0, uTextureCube2, refractVec, mixRatio);
      }
    }
  }

  gl_FragColor = envColor;

}

