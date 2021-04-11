// Inspired By https://codepen.io/babak0t0/pen/JjErMdG
import FontFaceObserver from "fontfaceobserver";
import imagesLoaded from "imagesloaded";

// const lerp = (a, b, n) => (1 - n) * a + n * b;

// const config = {
//   height: window.innerHeight,
//   width: window.innerWidth,
// };

const normalizeBetweenTwoRanges = (val, minVal, maxVal, newMin, newMax) => {
  return newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal);
};

export default class SmoothScroll {
  constructor() {
    this.bindMethods();

    this.data = {
      ease: 0.05,
      current: 0,
      last: 0,
      rounded: 0,
    };

    this.dom = {
      main: document.querySelector("main"),
      content: document.querySelector(".scroll-content"),
      contents: [...document.querySelectorAll(".scroll-content h2")],
      imgContent: document.querySelector(".scroll-content-img"),
      imgContents: [
        ...document.querySelectorAll(".scroll-content-img .wrapper-img"),
      ],
    };

    this.scrollableHeight = 0;
    this.scrollableWidth =
      this.dom.imgContent.getBoundingClientRect().width -
      this.dom.imgContents[0].getBoundingClientRect().width;

    this.raf = null;

    this.init();
  }

  bindMethods() {
    ["resize", "scroll", "run"].forEach(
      (fn) => (this[fn] = this[fn].bind(this))
    );
  }

  setHeight() {
    this.scrollableHeight =
      this.dom.content.clientHeight - this.dom.contents[0].clientHeight;

    this.dom.main.style.height = `${
      document.body.clientHeight + this.scrollableHeight
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
    // Ease
    this.data.last += (this.data.current - this.data.last) * this.data.ease;
    this.data.rounded = Math.round(this.data.last * 100) / 100;

    // Normalize scrollY to [0,1]
    this.dataNormarlized = normalizeBetweenTwoRanges(
      this.data.rounded,
      0,
      this.scrollableHeight,
      0,
      1
    );

    // Translate titles on Y axis
    this.dom.content.style.transform = `translate3d(0, -${this.data.rounded}px, 0)`;

    // Translate images on X axis depending on scrollY
    this.dom.imgContent.style.transform = `translate3d(-${
      this.dataNormarlized * this.scrollableWidth
    }px, 0, 0)`;

    this.requestAnimationFrame();
  }

  on() {
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
