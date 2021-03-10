import * as THREE from "three";
// import vertex from "../shader/vertex.glsl";
// import fragment from "../shader/fragment.glsl";

export default class Sketch {
  constructor(options) {
    console.log("CONSTRUCTOR");
    // this.clock = new THREE.Clock();

    // Get canvas and band from DOM
    this.canvas = document.querySelector("canvas.webgl");
    this.band = document.getElementById("band");

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    console.log(`constructorWidth ${this.width}`);
    console.log(`constructorHeight ${this.height}`);

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

    this.addBandRect();
    this.resize();
    this.setupResize();
    this.setPosition();

    this.render();
  }

  setupResize() {
    console.log("SETUP_RESIZE");
    window.addEventListener("resize", this.resize);
  }

  resize() {
    console.log("RESIZE");
    console.log(`initialWidth ${this.width}`);
    console.log(`initialHeight ${this.height}`);
    // Update sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    console.log(`resizeWidth ${this.width}`);
    console.log(`resizeHeight ${this.height}`);

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

  addBandRect() {
    console.log("ADD_BAND_RECT");
    const bandRect = this.band.getBoundingClientRect();

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix 
            * modelViewMatrix 
            * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
        }
      `,
      side: THREE.DoubleSide,
      // wireframe: true,
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
    const mesh = new THREE.Mesh(geometry, material);
    // mesh.scale.set(bandRect.width, bandRect.height, 1);
    this.scene.add(mesh);

    this.bandShader = {
      mesh,
      height: bandRect.height,
      width: bandRect.width,
      top: bandRect.top,
      left: bandRect.left,
    };
  }

  updateRect() {
    const bandRect = this.band.getBoundingClientRect();
    this.bandShader = {
      ...this.bandShader,
      height: bandRect.height,
      width: bandRect.width,
      top: bandRect.top,
      left: bandRect.left,
    };
  }

  // Normalize DOM coordinates system with Three.js coordinates system
  setPosition() {
    console.log("SET_POSITION");
    this.bandShader.mesh.position.x =
      this.bandShader.left - this.width / 2 + this.bandShader.width / 2;
    this.bandShader.mesh.position.y =
      -this.bandShader.top + this.height / 2 - this.bandShader.height / 2;

    this.bandShader.mesh.scale.set(
      this.bandShader.width,
      this.bandShader.height,
      1
    );
    console.log(this.bandShader.mesh.position);
  }

  render() {
    // this.elapsedTime = this.clock.getElapsedTime();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.render);
  }
}
