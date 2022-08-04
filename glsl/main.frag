precision mediump float;

varying vec4 vColor;
varying vec3 vNormal;

// 経過時間を uniform 変数として受け取る
uniform float uTime;
uniform mat4 normalInverseMatrix;

vec3 light = vec3(1.0, 1.0, 1.0);
float dotScale = 0.5;

void main(){
  vec3 n = (normalInverseMatrix * vec4(vNormal, 0.0)).xyz;
  float d = dot(normalize(n), normalize(light));
  vec4 color = vec4(vColor.rgb * d, vColor.a);
  gl_FragColor = color;
}

