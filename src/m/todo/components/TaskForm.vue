<script setup lang="ts">
import {Task} from "../entity/Task";
import {computed, ref} from "vue";
import {useTodoStore} from "../store/useTodoStore";
import Comment from "./detail/Comment.vue";
import Link from "./detail/Link.vue";
import {PlusCircleOutlined} from "@ant-design/icons-vue";
import Checklist from "./detail/Checklist.vue";
import GlSimpleEditor from "./detail/SimpleEditor.vue";

const dateFormat = 'YYYY年MM月DD日'
const valueFormat = 'YYYY-MM-DD'
const props = defineProps({
  task: Task
})
const formState: Task = props.task || new Task()
const showDescriptionEditor = ref(!!formState.description)
const showTitleInput = ref(false)
const onFinish = () => {
}
const onFinishFailed = () => {
}

const todoStore = useTodoStore()

const updateTask = () => {

}

// tabs
const activeTabKey = ref('1')

const linkForm = ref()
const showLinkForm = () => {
  linkForm.value.showLinkForm()
}
const onSaveLinkForm = (form: object) => {
  console.log(form)
}

const taskDetailTabTitles = computed(() => {

  return {
    comment: '评论(' + todoStore.commentStore.comments.length + ')',
    checklist: '检查项(' + todoStore.checklistStore.items.length + ')',
    link: '关联链接(' + todoStore.linkStore.links.length + ')'
  }
})


const descriptionEditor = ref()
const openDescriptionEditor = () => {
  showDescriptionEditor.value = true
  let interval = setInterval(function () {
    // document.getElementById('descriptionEditor')?.focus()
    descriptionEditor.value.focus()
    clearInterval(interval)
  }, 200);
}
const openTitleInput = () => {
  showTitleInput.value = true
  let interval = setInterval(function () {
    document.getElementById('titleInput')?.focus()
    // let mouseEvent = new MouseEvent('click')
    // const dom = document.getElementById('xxx')
    // dom?.dispatchEvent(mouseEvent)
    clearInterval(interval)
  }, 200);

}
</script>

<template>
  <div class="gl-task-form">
    <div class="gl-task-form-base">
      <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 21 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item label="任务" name="title" :rules="[{ required: true, message: '请输入任务名称' }]">
          <a-textarea id="titleInput" v-show="showTitleInput" v-model:value="formState.title"
                      @blur="showTitleInput=false"/>
          <div v-show="!showTitleInput" @click="openTitleInput" style="padding: 4px 10px;">
            {{ formState.title }}
          </div>
        </a-form-item>

        <a-form-item label="日期">
          <a-input-group compact>
            <a-date-picker v-model:value="formState.startDate" :format="dateFormat" :valueFormat="valueFormat"
                           style="width: 45%" placeholder="开始日期" title="开始日期"/>
            <span style="width: 10%;text-align: center">~</span>
            <a-date-picker v-model:value="formState.dueDate" :format="dateFormat" :valueFormat="valueFormat"
                           style="width: 45%" placeholder="截至日期"/>
          </a-input-group>
        </a-form-item>
        <a-form-item label="备注" name="description">
          <a-button type="link" v-show="!showDescriptionEditor" @click="openDescriptionEditor">添加备注</a-button>
          <!--        <a-textarea v-model:value="formState.description" :rows="5" style="width: 100%"/>-->
          <GlSimpleEditor ref="descriptionEditor" v-show="showDescriptionEditor" :html="formState.description"
                          @update="(html)=>{formState.description=html}"
                          :editorStyle="{'min-height':'48px','max-height':'280px','overflow-y':'auto'}"
          ></GlSimpleEditor>
        </a-form-item>
      </a-form>
    </div>
    <div class="gl-task-form-detail">
      <a-tabs v-model:activeKey="activeTabKey">
        <a-tab-pane key="1" :tab="taskDetailTabTitles.comment">
          <Comment></Comment>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="taskDetailTabTitles.checklist" force-render>
          <Checklist></Checklist>
        </a-tab-pane>
        <a-tab-pane key="3" :tab="taskDetailTabTitles.link" force-render>
          <Link ref="linkForm" @onSave="onSaveLinkForm"></Link>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style scoped>
.gl-task-form {
  display: flex;
  flex-direction: column;
}

.gl-task-form-detail {
  flex: 1;
  overflow-y: auto;
}
</style>
