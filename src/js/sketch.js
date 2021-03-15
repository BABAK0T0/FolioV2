import * as THREE from "three";
import vertex from "../shader/vertex.glsl";
import fragment from "../shader/fragment.glsl";
import gsap from "gsap";

export default class Sketch {
  constructor(options) {
    this.clock = new THREE.Clock();

    // Get canvas and band from DOM
    this.canvas = document.querySelector("canvas.webgl");
    this.main = document.querySelector("div.container");
    // this.band = document.getElementById("band");

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
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);

    // Use bind to get the right context
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.addMainRect();
    this.onMouseMove();
    this.resize();
    this.setupResize();
    this.setPosition();

    this.render();
  }

  onMouseMove() {
    window.addEventListener(
      "mousemove",
      (e) => {
        this.mouse.x = (e.clientX / this.width) * 2 - 1;
        this.mouse.y = -(e.clientY / this.height) * 2 + 1;

        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length) {
          const obj = intersects[0].object;
          obj.material.uniforms.uHover.value = intersects[0].uv;
        }
      },
      false
    );

    this.main.addEventListener("mouseenter", (e) => {
      gsap.to(this.material.uniforms.uHoverState, {
        duration: 1,
        value: 1,
      });
    });

    this.main.addEventListener("mouseout", (e) => {
      gsap.to(this.material.uniforms.uHoverState, {
        duration: 1,
        value: 0,
      });
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

    this.updateRect();
    this.setPosition();
  }

  addMainRect() {
    const bandRect = this.main.getBoundingClientRect();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHover: { value: new THREE.Vector2(0.5) },
        uHoverState: { value: 0 },
        uFromColor: { value: new THREE.Color(0x000000) },
        uToColor: { value: new THREE.Color(0xcadfff) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      // wireframe: true,
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
    const mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(mesh);

    this.mainShader = {
      mesh,
      height: bandRect.height,
      width: bandRect.width,
      top: bandRect.top,
      left: bandRect.left,
    };
  }

  updateRect() {
    const bandRect = this.main.getBoundingClientRect();
    this.mainShader = {
      ...this.mainShader,
      height: bandRect.height,
      width: bandRect.width,
      top: bandRect.top,
      left: bandRect.left,
    };
  }

  // Normalize DOM coordinates system with Three.js coordinates system
  setPosition() {
    this.mainShader.mesh.position.x =
      this.mainShader.left - this.width / 2 + this.mainShader.width / 2;
    this.mainShader.mesh.position.y =
      -this.mainShader.top + this.height / 2 - this.mainShader.height / 2;

    this.mainShader.mesh.scale.set(
      this.mainShader.width,
      this.mainShader.height,
      1
    );
  }

  render() {
    // Update uTime on each frame
    this.elapsedTime = this.clock.getElapsedTime();
    this.material.uniforms.uTime.value = this.elapsedTime;

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.render);
  }
}
