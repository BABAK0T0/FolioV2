import * as THREE from "three";
import vertex from "../shader/vertex.glsl";
import fragment from "../shader/fragment.glsl";

export default class Plane {
  constructor(opts) {
    this.scene = opts.scene;
    this.link = opts.link;
    this.texture = opts.texture;
    this.wireframe = opts.wireframe;

    this.add();
  }

  add() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        // uTime: { value: 0 },
        // uTexture: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      wireframe: this.wireframe,
    });

    this.geometry = new THREE.PlaneGeometry(2, 1, 10, 10);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.mesh.position.set()
    // this.scene.add(this.mesh);
  }

  remove() {
    this.scene.remove(this.mesh);
  }
}
