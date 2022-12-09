<script setup lang="ts">
import {PlusCircleOutlined} from "@ant-design/icons-vue";
import {onMounted, ref} from "vue";
import {useAppStore} from "../store/useAppStore";
import AppForm from "./AppForm.vue";

const appForm = ref()

const appStore = useAppStore()

onMounted(()=>{
  appStore.loadAll()
})

const openAppForm = () => {
  appForm.value.openModal()
}

</script>

<template>
  <div class="gl-desktop-wrapper">
    <div class="gl-desktop">
      <div class="gl-toolbar">
        <a-button @click="openAppForm">添加常用应用</a-button>
      </div>
      <div class="gl-desktop-apps-star">
        <div>
          <img style="border-radius: 10px;width: 320px;height: 11em" src="/public/desktop/house-gacfe1486d_640.png">
        </div>
        <div class="gl-items">
          <div class="gl-item" v-for="item in appStore.items">
            <!--            <div class="gl-icon"><img src="/public/desktop/app_dedao.ico"></div>-->
            <div class="gl-icon"><img :src="item.iconSrc"></div>
            <div class="gl-title"><a :href="item.index" target="_blank">{{item.name}}</a></div>
          </div>
<!--          <div class="gl-item">-->
<!--            <div class="gl-icon">-->
<!--              <PlusCircleOutlined/>-->
<!--            </div>-->
<!--&lt;!&ndash;            <div class="gl-icon"><img src="https://www.36kr.com/favicon.ico"></div>&ndash;&gt;-->
<!--            <div class="gl-title" ><a>添加常用</a></div>-->
<!--          </div>-->
        </div>
      </div>
      <div class="gl-desktop-apps-more">

      </div>
      <AppForm ref="appForm"></AppForm>
    </div>
  </div>
</template>

<style scoped>
.gl-desktop-wrapper {
}

.gl-desktop {
  display: flex;
  flex-direction: column;
  padding: 1em;
}

.gl-toolbar{
  padding-bottom: 1em;
}
.gl-toolbar > * {
  float: right;
}

.gl-desktop-apps-star {
  display: flex;
}

.gl-items {
  display: flex;
  flex-wrap: wrap;

}

.gl-item {
  border-radius: 10px;
  background-color: #ffffff;
  margin: 0 0 1em 1em;
  padding: 1em 1em;
  height: 5em;
  width: 14em;
  box-shadow: 0 3px 8px 0 rgba(231, 231, 231, 0.81), 0 6px 10px 0 rgba(231, 231, 231, 0.6)
}
.gl-item:hover{
  box-shadow: 0 3px 8px 0 rgba(231, 231, 231, 0.81), 0 6px 10px 0 rgb(215, 214, 214)
}

.gl-item > * {
  display: inline-block;
}

.gl-icon {
  padding: 0.3em;
}

.gl-icon > * {
  border-radius: 10px;
  width: 2.4em;
  height: 2.4em;
  line-height: 2.4em;
}

.gl-title{
  margin-left: 0.5em;
  line-height: 2.4em;
}
.gl-title > a {
  color: black;
}
</style>
