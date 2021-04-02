// Inspired by https://codepen.io/ReGGae/pen/BYJMQm

import gsap from "gsap";

const lerp = (a, b, n) => (1 - n) * a + n * b;

export default class SmoothScroll {
  constructor(opts) {
    this.container = document.querySelector(opts.scrollContainer);
    this.elems = [...this.container.querySelectorAll(opts.scrollElems)];
    this.elProps = [];

    this.init();
  }

  setHeight() {
    document.body.style.height = this.container.clientHeight + "px";
  }

  setElemScrollProperties() {
    this.elProps = this.elems.map((elem) => {
      return {
        el: elem,
        sy: 0,
        dy: 0,
        ease: elem.dataset.ease || 0,
      };
    });
  }

  scroll() {
    this.elProps.forEach((el) => {
      el.sy = window.scrollY;
    });
  }

  transformElem() {
    this.elProps.forEach((elem, i) => {
      //   const ease = `0.1${i}`
      const ease = `0.1`;
      elem.dy = lerp(elem.dy, elem.sy, ease);
      elem.dy = Math.floor(elem.dy * 100) / 100;

      gsap.to(elem.el, { y: -elem.dy });
    });

    window.requestAnimationFrame(this.transformElem.bind(this));
  }

  init() {
    this.setHeight();
    this.setElemScrollProperties();

    window.addEventListener("scroll", this.scroll.bind(this));
    window.requestAnimationFrame(this.transformElem.bind(this));
  }
}

// const scroll = new SmoothScroll({
//   scrollContainer: ".js-scroll-content",
//   scrollElems: ".js-scroll-element",
// });
