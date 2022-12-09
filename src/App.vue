<script setup lang="ts">
import GlLayout from "./m/layout/components/Index.vue"
import SidebarLeft from "./m/layout/components/SidebarLeft.vue";
</script>

<template>
  <div>
    <GlLayout>
      <template #sidebarLeftPanel="sidebarLeftPanelProps">
        <SidebarLeft v-bind="sidebarLeftPanelProps"></SidebarLeft>
      </template>
      <template #sidebarRightPanel="sidebarRightPanelProps">
      </template>
      <template #stageBannerPanel="stageBannerPanelProps">
      </template>
      <template #stageMainPanel="stageMainPanelProps">
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view v-bind="stageMainPanelProps"></router-view>
      </template>
    </GlLayout>
  </div>
</template>

<style scoped>
</style>
