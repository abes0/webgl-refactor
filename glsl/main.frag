precision mediump float;

// varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;
// varying vec2 vTexCoord;

// 経過時間を uniform 変数として受け取る
uniform mat4 normalInverseMatrix;
// uniform float uTime;
// uniform vec2 uMousePos;
uniform samplerCube uTexture0;
uniform bool refraction;
uniform float refractiveIndex;
uniform vec3 eyePos;

// vec3 light = vec3(1.0, 1.0, 1.0);
// float dotScale = 0.5;

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
  vec3 eyeDir = normalize(vPosition - eyePos);
  vec3 normal = normalize(vNormal);
  vec3 refractVec = normal;

  if(refraction == true) {
    float eta = 1.0 / refractiveIndex;
    refractVec = refract(eyeDir, normal, eta);
  }

  vec4 envColor = textureCube(uTexture0, refractVec);
  gl_FragColor = envColor;

}

