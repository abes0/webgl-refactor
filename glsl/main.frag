precision mediump float;

varying vec4 vColor;
varying vec3 vNormal;

// 経過時間を uniform 変数として受け取る
uniform mat4 normalInverseMatrix;
uniform float uTime;
uniform vec2 uMousePos;

vec3 light = vec3(1.0, 1.0, 1.0);
float dotScale = 0.5;

void main(){
  vec3 n = (normalInverseMatrix * vec4(vNormal, 0.0)).xyz;
  float d = dot(normalize(n), normalize(light));
  vec4 color = vec4(sin(uTime) + uMousePos.y, vColor.g + uMousePos.x, vColor.b * d, vColor.a);
  gl_FragColor = color;
}

