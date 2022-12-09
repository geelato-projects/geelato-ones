<script setup lang="ts">
// @ts-nocheck
import {ref, toRaw, unref} from "vue";
import {Link} from "../../entity/Link";
import {useTodoStore} from "../../store/useTodoStore";
import {LinkOutlined, PlusCircleOutlined} from "@ant-design/icons-vue";
import GlList from '../../../common/components/GlList.vue'

const todoStore = useTodoStore()
const emit = defineEmits(['onSave'])
const formVisible = ref(false)
const formState = ref(new Link())
const onSave = () => {
  if (!formState.value.title || !formState.value.url) {
    return
  }
  formVisible.value = false
  if (formState.value.id) {
    todoStore.linkStore.update(toRaw(unref(formState)))
  } else {
    todoStore.linkStore.add(formState.value.title, formState.value.url)
  }
  emit('onSave', toRaw(unref(formState)))
  formState.value = new Link()
}
const onDelete = (item: any, index: number) => {
  todoStore.linkStore.delete(item.id)
  console.log(item, index)
}
const showLinkForm = () => {
  formVisible.value = true
}
defineExpose({showLinkForm})
</script>

<template>
  <div>
    <div class="gl-toolbar" style="padding-bottom: 4px">
      <a-button type="link" @click="showLinkForm">添加
        <template #icon>
          <PlusCircleOutlined/>
        </template>
      </a-button>
    </div>
    <GlList :items="todoStore.linkStore.links" :showDelete="true" @deleteClick="onDelete">
      <template #icon="iconProps">
        <LinkOutlined/>
      </template>
      <template #title="titleProps">
        <a class="gl-href" target="_blank" :href="titleProps.item.url">{{ titleProps.item.title }}</a>
      </template>
      <template #extra="extraProps">
      </template>
    </GlList>
    <a-modal v-model:visible="formVisible" title="关联链接信息" @ok="onSave">
      <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 21 }"
          autocomplete="off"
      >
        <a-form-item label="标题" name="title">
          <a-input v-model:value="formState.title"/>
        </a-form-item>
        <a-form-item label="URL地址" name="url">
          <a-input v-model:value="formState.url" @keyup.enter="onSave"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>

</style>
