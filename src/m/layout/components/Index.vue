<script setup lang="ts">
import {LayoutStore} from "../store/LayoutStore";

const layoutStore = LayoutStore()
window.onresize = () => {
  layoutStore.resize()
}
layoutStore.resize()
</script>

<template>
  <div class="gl-layout">
    <div class="gl-layout-sidebar"
         :style="{'width':layoutStore.sidebarPanelWidth+'px','height':layoutStore.sidebarPanelHeight+'px'}">
      <slot name="sidebarLeftPanel" :style="{'width':layoutStore.sidebarLeftPanelWidth+'px'}"></slot>
      <slot name="sidebarRightPanel" :style="{'width':layoutStore.sidebarRightPanelWidth+'px'}"></slot>
    </div>
    <div class="gl-layout-stage">
      <slot name="stageBannerPanel"></slot>
      <slot name="stageMainPanel" :style="{'width':layoutStore.stagePanelWidth+'px','height':layoutStore.stageMainPanelHeight+'px',padding:'1em'}"></slot>
    </div>
    <div class="gl-layout-setter">
      <slot name="setter"></slot>
    </div>
  </div>
</template>

<style>
.gl-layout {
  display: flex;
  overflow-x:hidden;
}

.gl-layout-sidebar {
  border-right: 1px solid var(--gl_nav_dark-gray);
  /* x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
  box-shadow: 1px 0px 2px 1px rgba(231, 231, 231, 0.81);
}
.gl-layout-stage{
  /*margin: 1em 0 0 1em;*/
}
</style>
