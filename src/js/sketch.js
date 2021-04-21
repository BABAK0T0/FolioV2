import * as THREE from "three";
import Plane from "./plane";

export default class Sketch {
  constructor(opts) {
    this.clock = new THREE.Clock();

    this.scroll = opts.scroll;

    this.dom = {
      canvas: document.querySelector("canvas.webgl"),
      images: [
        ...document.querySelectorAll(".scroll-content-img .wrapper-img"),
      ],
    };

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      100,
      2000
    );
    this.camera.position.z = 600;

    this.camera.fov =
      2 * Math.atan(this.height / 2 / this.camera.position.z) * (180 / Math.PI);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.dom.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);

    // Use bind to get the right context
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);

    this.setPosition.bind(this);

    this.addImages();
    this.setPosition();

    this.resize();
    this.setupResize();

    this.render();
  }

  addImages() {
    this.group = new THREE.Group();

    this.imgDatas = this.dom.images.map((DOMimg) => {
      const { left, top, height, width } = DOMimg.getBoundingClientRect();

      const plane = new Plane({
        scene: this.scene,
        link: "#",
        texture: null,
        wireframe: false,
        position: { left, top, height, width },
      });

      this.group.add(plane.mesh);

      return {
        mesh: plane.mesh,
        img: DOMimg,
        left,
        top,
        height,
        width,
      };
    });

    this.scene.add(this.group);
  }

  // Normalize DOM coordinates system with Three.js coordinates system
  setPosition() {
    this.imgDatas.forEach((img) => {
      img.mesh.position.x =
        -this.scroll().x + img.left - this.width / 2 + img.width / 2;
      img.mesh.position.y = -img.top + this.height / 2 - img.height / 2;
    });
  }

  updateBounds() {
    this.imgDatas = this.imgDatas.map((img) => {
      const { left, top, height, width } = img.img.getBoundingClientRect();
      img.mesh.scale.set(width, height, 1);

      return {
        ...img,
        left,
        top,
        height,
        width,
      };
    });
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
    this.camera.fov =
      2 * Math.atan(this.height / 2 / this.camera.position.z) * (180 / Math.PI);
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update position
    this.updateBounds();
    this.setPosition();
  }

  render() {
    // Update uTime on each frame
    this.elapsedTime = this.clock.getElapsedTime();
    // this.material.uniforms.uTime.value = this.elapsedTime;

    // Update planes position
    this.setPosition();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.render);
  }
}
