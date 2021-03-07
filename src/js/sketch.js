import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertex from "../shader/vertex.glsl";
import fragment from "../shader/fragment.glsl";

export default class Sketch {
  constructor(options) {
    this.clock = new THREE.Clock();

    this.canvas = document.querySelector("canvas.webgl");

    this.height = window.innerHeight;
    this.width = window.innerWidth;

    this.render = this.render.bind(this);

    this.resize();
    this.init();
    this.initControls();
    this.render();
  }

  resize() {
    window.addEventListener(
      "resize",
      () => {
        // Update sizes
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Update camera
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      },
      false
    );
  }

  init() {
    /**
     * Camera
     */
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    );

    this.camera.position.z = 3;

    /**
     * Scene
     */
    this.scene = new THREE.Scene();

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);

    /**
     * Renderer
     */
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  render() {
    this.elapsedTime = this.clock.getElapsedTime();
    this.mesh.rotation.x = this.elapsedTime;
    this.mesh.rotation.y = this.elapsedTime;

    // Update OrbitControls
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render);
  }
}
