import * as THREE from "three";
import vertex from "../shader/vertex.glsl";
import fragment from "../shader/fragment.glsl";

export default class Plane {
  constructor(opts) {
    this.scene = opts.scene;
    this.link = opts.link;
    this.texture = opts.texture;
    this.position = opts.position;
    this.wireframe = opts.wireframe;

    this.add();
  }

  add() {
    const texture = new THREE.Texture(this.texture);
    texture.needsUpdate = true;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: 0 },
        uVelocity: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      wireframe: this.wireframe,
    });

    this.material.uniforms.uTexture.value = texture;
    this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(this.position.width, this.position.height, 1);
  }

  remove() {
    this.scene.remove(this.mesh);
  }
}
