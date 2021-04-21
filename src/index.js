import SmoothScroll from "./js/smoothScroll";
import Sketch from "./js/sketch";

const scroll = new SmoothScroll();

new Sketch({
  scroll: scroll.getScroll,
});
