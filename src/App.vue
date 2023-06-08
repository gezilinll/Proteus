<template>
  <canvas id="renderTarget" class="full-canvas"></canvas>
  <button @click="addGraphic">添加矩形</button>
</template>

<script setup lang="ts">
import { Application, Graphics } from "pixi.js";
import { onMounted } from "vue";
import { HocuspocusProvider } from "@hocuspocus/provider";

const provider = new HocuspocusProvider({
  url: "ws://47.119.150.226:3000",
  name: "example-document",
});
const graphics = provider.document.getArray("graphics");
console.log(graphics);
graphics.observe((e) => {
  console.log(
    "graphics were modified",
    e,
    provider.document.clientID,
    provider.document.toJSON()
  );
});

let app: Application | null = null;

function addGraphic() {
  let obj = new Graphics();
  obj.beginFill(0xff0000);
  obj.drawRect(0, 0, 200, 100);
  app!.stage.addChild(obj);

  graphics.push(["new graphic"]);
  console.log("addGraphic", graphics);
}

onMounted(() => {
  app = new Application({
    view: document.getElementById("renderTarget") as HTMLCanvasElement,
    antialias: true,
    backgroundAlpha: 0.5,
    resolution: window.devicePixelRatio,
  });

  console.log(document.getElementById("renderTarget"));
});
</script>

<style lang="less">
.full-canvas {
  width: 60%;
  height: 500px;
}
</style>
