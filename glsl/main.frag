precision mediump float;

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

// 経過時間を uniform 変数として受け取る
uniform mat4 normalInverseMatrix;
uniform float uTime;
uniform vec2 uMousePos;
uniform sampler2D uTexture0;

vec3 light = vec3(1.0, 1.0, 1.0);
float dotScale = 0.5;

void main(){
  vec3 n = (normalInverseMatrix * vec4(vNormal, 0.0)).xyz;
  float d = dot(normalize(n), normalize(light));
  vec4 texture = texture2D(uTexture0, vTexCoord);
  // vec4 color = vec4(sin(uTime) + uMousePos.y, vColor.g + uMousePos.x, vColor.b * d, vColor.a);
  // vec4 color = vec4(vPosition.xyz / 50., 1.0);
  // vec4 color = vec4(vColor.xyz * d, 1.);
  // vec4 color = vec4(vColor.xyz, 1.0);
  vec4 color = vec4(texture.xyz * d * uMousePos.x, texture.w);
  gl_FragColor = color;
}

