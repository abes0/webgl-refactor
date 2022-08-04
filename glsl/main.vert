attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;

uniform float uTime;
uniform mat4 mvpMatrix;
uniform mat4 normalInverseMatrix;

varying vec4 vColor;
varying vec3 vNormal;

void main(){
  vColor = color;
  vNormal = normal;
  gl_Position = mvpMatrix * vec4(position, 1.0);
}

