uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    vec2 zoomedUV = vec2(vUv.x, vUv.y * 0.6 + 0.2);
    gl_FragColor = texture2D( uTexture, zoomedUV);
}