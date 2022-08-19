attribute vec3 position;
// attribute vec4 color;
attribute vec3 normal;
attribute vec2 texCoord;

// varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
uniform mat4 normalInverseMatrix;
// uniform float uTime;
uniform vec2 uMousePos;

void main(){
  // vColor = color;
  // vec3 pos = vec3(position.x + uMousePos.x,position.y + uMousePos.y, position.z);
  vPosition = (mMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize((normalInverseMatrix * vec4(normal, 0.0)).xyz);
  vTexCoord = texCoord;

  // gl_Position = mvpMatrix * vec4(position.x, position.y, sin( position.x * (uTime / 100.)) * 100., 1.);
  // position.x * (uTime * 10000.)
  // gl_Position = mvpMatrix * vec4(position.x * uMousePos.x, position.y, position.z * sin(uTime), 1.0);

  gl_Position = mvpMatrix * vec4(position, 1.);
}

