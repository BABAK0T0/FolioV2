import Sketch from "./js/sketch";
import DebugPanel from "./js/debugPanel";

const init = () => {
  new Sketch();
  new DebugPanel({ visibility: false });
};

init();
