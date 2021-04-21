uniform sampler2D uTexture;
varying vec2 vUv;
varying float vWave;

void main() {
    vec2 zoomedUV = vec2(vUv.x, vUv.y * 0.6 + 0.2);
    float wave = vWave * 0.15;

    float r = texture2D(uTexture, zoomedUV + wave).r;
    float g = texture2D(uTexture, zoomedUV).g;
    float b = texture2D(uTexture, zoomedUV).b;
    vec3 texture = vec3(r, g, b);

    gl_FragColor = vec4(texture, 1.0);
}