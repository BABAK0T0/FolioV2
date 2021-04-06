// Inspired by https://codepen.io/ReGGae/pen/BYJMQm

import gsap from "gsap";

const lerp = (a, b, n) => (1 - n) * a + n * b;

export default class SmoothScroll {
  constructor(opts) {
    this.content = document.querySelector(opts.scrollContainer);
    this.elems = [...this.content.querySelectorAll(opts.scrollElems)];

    this.cache = [];

    this.init();
  }

  setHeight() {
    const bodyHeight = document.body.clientHeight;
    const elemHeight = this.elems[0].clientHeight;

    const topFirstElem = this.elems[0].getBoundingClientRect().top;
    const bottomLastElem = this.elems[
      this.elems.length - 1
    ].getBoundingClientRect().bottom;
    const scrollElemsHeight = bottomLastElem - topFirstElem;

    document.body.style.height =
      bodyHeight + (scrollElemsHeight - elemHeight) + "px";
  }

  setCache() {
    this.elems.forEach((elem) => {
      const elemCache = {};
      elemCache.el = elem;
      elemCache.sy = 0;
      elemCache.dy = 0;
      elemCache.ease = elem.dataset.ease;

      this.cache.push(elemCache);
    });
  }

  scroll() {
    this.cache.forEach((el) => {
      el.sy = window.scrollY;
    });
  }

  transformElem() {
    this.cache.forEach((elem, i) => {
      const ease = elem.ease || `0.1${i}`;
      elem.dy = lerp(elem.dy, elem.sy, ease);
      elem.dy = Math.floor(elem.dy * 100) / 100;

      gsap.to(elem.el, { y: -elem.dy });
    });

    window.requestAnimationFrame(this.transformElem.bind(this));
  }

  init() {
    this.setHeight();
    this.setCache();

    window.addEventListener("scroll", this.scroll.bind(this));
    window.requestAnimationFrame(this.transformElem.bind(this));
  }
}
