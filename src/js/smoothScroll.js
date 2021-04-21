import FontFaceObserver from "fontfaceobserver";
import imagesLoaded from "imagesloaded";

const normalizeBetweenTwoRanges = (val, minVal, maxVal, newMin, newMax) => {
  return newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal);
};

export default class SmoothScroll {
  constructor() {
    this.bindMethods();

    this.smoothScroll = {
      x: 0,
      y: 0,
      velocity: 0,
    };

    this.data = {
      ease: 0.05,
      current: 0,
      last: 0,
      rounded: 0,
    };

    this.dom = {
      main: document.querySelector("main"),
      titleContainer: document.querySelector(".scroll-content"),
      title: document.querySelector(".scroll-content h2"),
      imageContainer: document.querySelector(".scroll-content-img"),
      image: document.querySelector(".scroll-content-img .wrapper-img"),
    };

    this.scrollableHeight = 0;
    this.scrollableWidth = 0;

    this.raf = null;

    this.init();
  }

  bindMethods() {
    ["resize", "scroll", "run", "getScroll"].forEach(
      (fn) => (this[fn] = this[fn].bind(this))
    );
  }

  setScrollSize() {
    // Minus an element will set the last element at the default first element position
    this.scrollableHeight =
      this.dom.titleContainer.clientHeight - this.dom.title.clientHeight;

    this.scrollableWidth =
      this.dom.imageContainer.clientWidth - this.dom.image.clientWidth;

    // Make the content scrollable instead of the document.body
    this.dom.main.style.height = `${
      document.body.clientHeight + this.scrollableHeight
    }px`;
  }

  resize() {
    this.setScrollSize();
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
      imagesLoaded(this.dom.titleContainer, { background: true }, () => {
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
      this.setScrollSize();
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
    this.dom.titleContainer.style.transform = `translate3d(0, -${this.data.rounded}px, 0)`;

    // Translate images on X axis depending on scrollY
    this.dom.imageContainer.style.transform = `translate3d(-${
      this.dataNormarlized * this.scrollableWidth
    }px, 0, 0)`;

    this.smoothScroll.y = this.data.rounded;
    this.smoothScroll.x = this.dataNormarlized * this.scrollableWidth;
    this.smoothScroll.velocity =
      (this.data.current - this.data.rounded) / window.innerWidth;

    this.requestAnimationFrame();
  }

  getScroll() {
    return this.smoothScroll;
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
