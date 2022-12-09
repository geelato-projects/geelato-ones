<script setup lang="ts">
// @ts-nocheck
import {ref, toRaw, unref} from "vue";
import {useTodoStore} from "../../store/useTodoStore";
import {LinkOutlined, PlusCircleOutlined} from "@ant-design/icons-vue";
import GlList from '../../../common/components/GlList.vue'
import CheckSwich from "../../../common/components/CheckSwich.vue";
import {Checklist} from "../../entity/Checklist";

const todoStore = useTodoStore()
const content = ref('')

const add = (event: KeyboardEvent) => {
  if (!content.value) {
    return
  }
  todoStore.checklistStore.add(content.value)
  content.value = ''
}

const onDelete = (item: any, index: number) => {
  todoStore.checklistStore.delete(item.id)
}
const onSwitch = (item: Checklist, checked: boolean) => {
  item.statusId = checked ? finished : unfinished
  todoStore.checklistStore.update(toRaw(item))
}
const onItemClick = (item: Checklist, index: number) => {
  console.log('onItemClick', item, index)
}
const unfinished = '10'
const finished = '11'
</script>

<template>
  <div>
    <a-input v-model:value.trim="content" @keyup.enter="add"
             placeholder="输入之后，按下回车即可添加"/>
    <GlList :items="todoStore.checklistStore.items" :showDelete="true" @deleteClick="onDelete" @itemClick="onItemClick">
      <template #icon="iconProps">
        <CheckSwich :checked="iconProps.item.statusId===finished"
                    @change="(checked)=>{onSwitch(iconProps.item,checked)}"></CheckSwich>
      </template>
      <template #title="titleProps">
        {{ titleProps.item.content }}
      </template>
      <template #extra="extraProps">
      </template>
    </GlList>
  </div>
</template>

<style scoped>

</style>
