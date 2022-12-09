<script setup lang="ts">
import {ref} from "vue";
import {useAppStore} from "../store/useAppStore";
const appStore = useAppStore()
const appListVisible = ref(false)
const openAppList = () => {
  appListVisible.value = true
}

const onDelete = () => {

}
defineExpose({openAppList})
</script>

<template>
  <div>
    <!--  表单   -->
    <a-modal width="100%" wrap-class-name="gl-full-modal" v-model:visible="appListVisible" title="所有评论信息"
             @ok="appListVisible=false">
      <div style="overflow-x:scroll">
        <div style="width:100%"><input width="100%"></div>

      </div>
      <template #footer>
        <a-button type="primary" @click="appListVisible=false">关闭</a-button>
      </template>
    </a-modal>
    <!--  列表  -->
    <a-modal width="100%" wrap-class-name="gl-full-modal" v-model:visible="appListVisible" title="所有评论信息"
             @ok="appListVisible=false">
      <div style="overflow-x:scroll">
        <div style="width:100%"><input width="100%"></div>
        <GlList :items="appStore.items" :showDelete="true" @deleteClick="onDelete">
          <template #icon="iconProps">
            <a-avatar src="https://joeschmoe.io/api/v1/random"/>
          </template>
          <template #title="titleProps">
            <div>{{ titleProps.item.title }}</div>
            <div v-html="titleProps.item.content"></div>
          </template>
          <template #extra="extraProps">
<!--            <span @click="editComment(extraProps.item)"><EditOutlined/></span>-->
          </template>
        </GlList>
      </div>
      <template #footer>
        <a-button type="primary" @click="appListVisible=false">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped>

</style>
