<script setup lang="ts">
import {useTodoStore} from "../store/useTodoStore";
import GlList from '../../common/components/GlList.vue'
import GlSimpleEditor from "./detail/SimpleEditor.vue";

import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
  StarFilled,
  EllipsisOutlined,
  FieldTimeOutlined,
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons-vue";
import {ref} from "vue";

const todoStore = useTodoStore()

const todayRecordEditor = ref()
const todayRecordEditorStyle = ref({'min-height': '6em', 'height': '400px', 'max-height': '100%', 'overflow-y': 'auto'})

const onSelectDay = async (item: any) => {
  await todoStore.loadDaylyLog(item.dayStr)
  // console.log('onSelectDay > setHtml:',todoStore.currentDaylyLog.content)
  todayRecordEditor.value.setHtml(todoStore.currentDaylyLog.content)
}
</script>

<template>
  <div class="daylyLog">
    <div style="width: 160px;display: inline-block">
      <div class="gl-title">日志记录</div>
      <GlList :items="todoStore.daylyLogs" @itemClick="onSelectDay">
        <template #icon="iconProps">
<!--          <EditOutlined/>--> |
        </template>
        <template #title="titleProps">
<!-- TODO    error TS2571: Object is of type 'unknown'.     -->
<!--          <span >{{ titleProps.item.dayStr }}</span>-->
        </template>
        <template #extra="extraProps">
        </template>
      </GlList>
    </div>
    <div style="padding-left:1em;flex:1">
      <div class="gl-title">详细信息</div>
      <div>
        <GlSimpleEditor ref="todayRecordEditor" :html="todoStore.currentDaylyLog.content"
                        @update="(html)=>{todoStore.currentDaylyLog.content=html}"
                        :editorStyle="todayRecordEditorStyle"
        ></GlSimpleEditor>
      </div>
    </div>
  </div>
</template>

<style scoped>
.daylyLog {
  display: -webkit-flex; /* Safari */
  display: flex;
}
</style>
