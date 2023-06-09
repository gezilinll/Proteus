<template>
  <canvas
    id="renderTarget"
    class="full-canvas"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  ></canvas>
</template>

<script setup lang="ts">
import { Application, Color } from "pixi.js";
import { onMounted } from "vue";
import { HocuspocusProvider } from "@hocuspocus/provider";
import paper from "paper";
import { v4 as uuidv4 } from "uuid";
import { YBinding } from "./collaborate/YBinding";
import { Graphics } from "./elements/Graphics";

const userID = uuidv4();
console.log("userID:", userID);

const provider = new HocuspocusProvider({
  url: "ws://47.119.150.226:3000",
  name: "example-document",
});
const binding = new YBinding(provider.document);

// let app: Application | null = null;
let currentElement: Graphics | null = null;

function onMouseDown(e: MouseEvent) {
  currentElement = new Graphics();
  currentElement.addPoint(e.clientX, e.clientY);
  binding.addElement(currentElement);
}

function onMouseMove(e: MouseEvent) {
  if (currentElement) {
    currentElement.addPoint(e.clientX, e.clientY);
    binding.updateElement(currentElement);
  }
}

function onMouseUp(e: MouseEvent) {
  if (currentElement) {
    currentElement.addPoint(e.clientX, e.clientY);
    binding.updateElement(currentElement);
  }
  currentElement = null;
}

onMounted(() => {
  const _paper = new paper.PaperScope();
  // _paper.setup(new paper.Size(1, 1));
  _paper.setup(document.getElementById("renderTarget") as HTMLCanvasElement);

  // app = new Application({
  //   view: document.getElementById("renderTarget") as HTMLCanvasElement,
  //   antialias: true,
  //   backgroundAlpha: 0.5,
  //   resolution: window.devicePixelRatio,
  // });
});
</script>

<style lang="less">
.full-canvas {
  width: 60%;
  height: 500px;
}
</style>
