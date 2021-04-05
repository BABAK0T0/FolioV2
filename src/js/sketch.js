import * as THREE from "three";
import Plane from "./plane";

export default class Sketch {
  constructor() {
    this.clock = new THREE.Clock();

    this.canvas = document.querySelector("canvas.webgl");

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.z = 1.5;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);

    // Use bind to get the right context
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);

    this.addProjects();

    this.resize();
    this.setupResize();

    this.render();
  }

  addProjects() {
    this.group = new THREE.Group();
    this.project_1 = new Plane({
      scene: this.scene,
      link: "#",
      texture: null,
      wireframe: false,
    });
    this.project_1.mesh.scale.set(1.2, 1.2, 0);

    this.project_2 = new Plane({
      scene: this.scene,
      link: "#",
      texture: null,
      wireframe: true,
    });
    this.project_2.mesh.position.x = 3;

    this.group.add(this.project_1.mesh);
    this.group.add(this.project_2.mesh);
    this.scene.add(this.group);
  }

  setupResize() {
    window.addEventListener("resize", this.resize);
  }

  resize() {
    // Update sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Update camera
    this.camera.aspect = this.width / this.height;

    // Update renderer
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  render() {
    // Update uTime on each frame
    this.elapsedTime = this.clock.getElapsedTime();
    // this.material.uniforms.uTime.value = this.elapsedTime;

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.render);
  }
}
