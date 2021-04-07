// Inspired By https://codepen.io/babak0t0/pen/JjErMdG
import FontFaceObserver from "fontfaceobserver";
import imagesLoaded from "imagesloaded";

// const lerp = (a, b, n) => (1 - n) * a + n * b;

// const config = {
//   height: window.innerHeight,
//   width: window.innerWidth,
// };

export default class SmoothScroll {
  constructor() {
    this.bindMethods();

    this.data = {
      ease: 0.1,
      current: 0,
      last: 0,
      rounded: 0,
    };

    this.dom = {
      main: document.querySelector("main"),
      // Titles part
      el: document.querySelector("#projects"),
      content: document.querySelector(".scroll-content"),
      contents: [...document.querySelectorAll(".scroll-content h2")],
      // Images part
      elImg: document.querySelector("#projects-img"),
      elImgContents: [
        ...document.querySelectorAll("#projects-img .wrapper-img"),
      ],
    };

    this.firstChildRect = this.dom.elImgContents[0].getBoundingClientRect();
    this.secondChildRect = this.dom.elImgContents[1].getBoundingClientRect();
    this.distanceNextChild = 0;

    this.raf = null;

    this.init();
  }

  bindMethods() {
    ["resize", "scroll", "run"].forEach(
      (fn) => (this[fn] = this[fn].bind(this))
    );
  }

  setHeight() {
    const bodyClientHeight = document.body.clientHeight;
    const contentClientHeight = this.dom.contents[0].clientHeight;

    const topFirstChild = this.dom.contents[0].getBoundingClientRect().top;
    const bottomLastChild = this.dom.contents[
      this.dom.contents.length - 1
    ].getBoundingClientRect().bottom;
    const scrollElemsHeight = bottomLastChild - topFirstChild;

    this.dom.main.style.height = `${
      bodyClientHeight + (scrollElemsHeight - contentClientHeight)
    }px`;
  }

  resize() {
    this.setHeight();
    this.scroll();
  }

  preload() {
    const fontNeueMontrealBold = new Promise((resolve) => {
      new FontFaceObserver("Neue Montreal Bold").load().then(() => {
        resolve();
      });
    });
    const fontNeueMontrealBoldItalic = new Promise((resolve) => {
      new FontFaceObserver("Neue Montreal Bold Italic").load().then(() => {
        resolve();
      });
    });
    const fontNeueMontrealLight = new Promise((resolve) => {
      new FontFaceObserver("Neue Montreal Light").load().then(() => {
        resolve();
      });
    });
    const fontNeueMontrealLightItalic = new Promise((resolve) => {
      new FontFaceObserver("Neue Montreal Light Italic").load().then(() => {
        resolve();
      });
    });
    const preloadImages = new Promise((resolve) => {
      imagesLoaded(this.dom.content, { background: true }, () => {
        resolve();
      });
    });

    Promise.all([
      fontNeueMontrealBold,
      fontNeueMontrealBoldItalic,
      fontNeueMontrealLight,
      fontNeueMontrealLightItalic,
      preloadImages,
    ]).then(() => {
      this.setHeight();
    });
  }

  scroll() {
    this.data.current = window.scrollY;
  }

  run() {
    this.data.last += (this.data.current - this.data.last) * this.data.ease;
    this.data.rounded = Math.round(this.data.last * 100) / 100;
    this.dom.content.style.transform = `translate3d(0, -${this.data.rounded}px, 0)`;

    const distanceCenterFirst =
      this.firstChildRect.left + this.firstChildRect.width / 2;
    const distanceCenterSecond =
      this.secondChildRect.left + this.secondChildRect.width / 2;

    this.distanceNextChild = distanceCenterSecond - distanceCenterFirst;

    const scrollNextChild = (this.data.rounded / 100) * this.distanceNextChild;

    // const offset = window.innerWidth - distanceCenterSecond;
    this.dom.elImg.style.transform = `translate3d(-${scrollNextChild}px, 0, 0)`;

    this.requestAnimationFrame();
  }

  on() {
    this.setHeight();
    this.addEvents();

    this.requestAnimationFrame();
  }

  requestAnimationFrame() {
    this.raf = requestAnimationFrame(this.run);
  }

  cancelAnimationFrame() {
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    document.body.style.height = "";

    this.data = null;

    this.removeEvents();
    this.cancelAnimationFrame();
  }

  /**
   * Improving scrolling performance with passive listeners to true
   * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners
   */
  addEvents() {
    window.addEventListener("resize", this.resize, { passive: true });
    window.addEventListener("scroll", this.scroll, { passive: true });
  }

  removeEvents() {
    window.removeEventListener("resize", this.resize, { passive: true });
    window.removeEventListener("scroll", this.scroll, { passive: true });
  }

  init() {
    this.preload();
    this.on();
  }
}
