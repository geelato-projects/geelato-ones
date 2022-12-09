<script setup lang="ts">
import {ProjectOutlined, UnorderedListOutlined, NotificationOutlined,ScheduleOutlined,DesktopOutlined} from "@ant-design/icons-vue";
import {ref} from "vue";

const currentSelectedItemName = ref('task')
const isTauriEnv  = !!window.__TAURI_IPC__
</script>

<template>
  <div class="gl-sidebar-left">
    <div class="gl-logo">
      <a-avatar src="/logo.png" aria-readonly="true"></a-avatar>
    </div>
    <div class="gl-sidebar-left-main">
      <router-link to="/desktop">
        <div class="gl-item" @click="currentSelectedItemName='desktop'"
             :class="{'gl-selected':currentSelectedItemName==='desktop'}">
          <div class="gl-icon">
            <component :is="DesktopOutlined"></component>
          </div>
          <div class="gl-title">桌面</div>
        </div>
      </router-link>
      <router-link to="/project">
        <div class="gl-item" @click="currentSelectedItemName='components'"
             :class="{'gl-selected':currentSelectedItemName==='components'}">
          <div class="gl-icon">
            <ProjectOutlined/>
          </div>
          <div class="gl-title">项目</div>
        </div>
      </router-link>
      <router-link to="/todo">
        <div class="gl-item" @click="currentSelectedItemName='task'"
             :class="{'gl-selected':currentSelectedItemName==='task'}">
          <div class="gl-icon">
            <UnorderedListOutlined/>
          </div>
          <div class="gl-title">任务</div>
        </div>
      </router-link>
      <router-link to="/schedule">
        <div class="gl-item" @click="currentSelectedItemName='schedule'"
             :class="{'gl-selected':currentSelectedItemName==='schedule'}">
          <div class="gl-icon">
            <ScheduleOutlined />
          </div>
          <div class="gl-title">日历</div>
        </div>
      </router-link>
    </div>
    <div class="gl-item" style="padding: 1.1em 0;margin-bottom: -8px">
      <NotificationOutlined/>
    </div>
    <router-link to="/me">
      <div class="gl-item" style="padding: 0.8em 0">
        <a-avatar src="/avator/4043260_avatar_male_man_portrait_icon.png"/>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.gl-sidebar-left {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  /*布局方向是垂直的*/
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: var(--gl_nav_white);
  /*background-color: #0467c2;*/

}

.gl-sidebar-left .gl-logo {
  margin: 1em auto 2em auto;
  width: 3em;
  height: 3em;
}

/*.gl-sidebar-left .gl-item.gl-end {*/
/*  margin-bottom: 1.5em;*/
/*}*/

.gl-sidebar-left-main {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.gl-sidebar-left .gl-item {
  margin: 8px;
  padding: 6px;
  border-radius: 10px;
  /*width: 5em;*/
  /*vertical-align: middle;*/
}

.gl-sidebar-left .gl-item:hover, .gl-sidebar-left .gl-item.gl-selected {
  background-color: var(--gl_nav_gray);
  cursor: pointer;
}

.gl-sidebar-left .gl-icon {
  /*color: var(--gl_nav_main);*/
  font-size: 1.2em;
}

.gl-sidebar-left .gl-title {
  font-size: 0.9em;
}
.gl-sidebar-left .gl-item .gl-title {
  color: black;
}
.gl-sidebar-left .gl-item.gl-selected .gl-title {
  color: var(--gl_nav_main);
}
</style>
