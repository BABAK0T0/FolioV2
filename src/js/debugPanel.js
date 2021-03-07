import * as dat from "dat.gui";

export default class DebugPanel {
  constructor(options) {
    this.gui = new dat.GUI({ width: 400 });
    this.visibility = options.visibility || false;

    this.visible();
  }

  visible() {
    this.visibility ? this.gui.show() : this.gui.hide();
  }
}
