<script setup lang="ts">
// @ts-nocheck
import {ref, toRaw, unref} from "vue";
import {useTodoStore} from "../../store/useTodoStore";
import {PictureOutlined, EditOutlined} from "@ant-design/icons-vue";
import GlList from '../../../common/components/GlList.vue'
import GlSimpleEditor from './SimpleEditor.vue'
import {Comment} from '../../entity/Comment'

const todoStore = useTodoStore()
const formState = ref(new Comment())
const title = ref('')
// const content = ref('')
const showContentEditor = ref('')
const addTitle = (event: KeyboardEvent) => {
  if (!title.value) {
    return
  }
  todoStore.commentStore.add(title.value)
  title.value = ''
  // content.value = ''
}

const onDelete = (item: any, index: number) => {
  todoStore.commentStore.delete(item.id)
}

const commentFormVisible = ref(false)

const editComment = (item: Comment) => {
  commentFormVisible.value = true
  formState.value = item
}
const onSaveComment = () => {
  todoStore.commentStore.update(toRaw(formState.value))
  commentFormVisible.value = false
}

const commentListVisible = ref(false)
</script>

<template>
  <div>
    <a-input v-model:value.trim="title" @keyup.enter="addTitle"
             placeholder="输入之后，按下回车即可添加"/>
    <GlList :items="todoStore.commentStore.comments" :showDelete="true" @deleteClick="onDelete">
      <template #icon="iconProps">
        <a-avatar src="https://joeschmoe.io/api/v1/random"/>
      </template>
      <template #title="titleProps">
        <div>{{ titleProps.item.title }}</div>
        <a v-if="titleProps.item.content" @click="commentListVisible=true">更多...</a>
      </template>
      <template #extra="extraProps">
        <span @click="editComment(extraProps.item)" class="gl-hidden gl-hover-as-inline-block"><EditOutlined/></span>
      </template>
    </GlList>
    <!--  comment编辑  -->
    <a-modal width="100%" wrap-class-name="gl-full-modal" v-model:visible="commentFormVisible" title="评论信息"
             @ok="commentFormVisible=false">
      <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 21 }"
          autocomplete="off"
      >
        <a-form-item label="标题" name="title">
          <a-input v-model:value="formState.title"/>
        </a-form-item>
        <a-form-item label="内容" name="content">
          <GlSimpleEditor id="contentEditor" :html="formState.content" @update="(html)=>{formState.content=html}"
                          @change="(html)=>{formState.content=html}"
                          :editorStyle="{height:'600px'}"
          ></GlSimpleEditor>
          <!--          <a-input v-model:value="formState.content" @keyup.enter="onSaveComment"/>-->
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" :disabled="!formState.title" @click="onSaveComment">确定</a-button>
      </template>
    </a-modal>
    <!--  comments全屏查看列表  -->
    <a-modal width="100%" wrap-class-name="gl-full-modal" v-model:visible="commentListVisible" title="所有评论信息"
             @ok="commentListVisible=false">
      <div style="overflow-x:scroll">
        <GlList :items="todoStore.commentStore.comments" :showDelete="false" @deleteClick="onDelete">
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
        <a-button type="primary" @click="commentListVisible=false">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<style>


</style>
