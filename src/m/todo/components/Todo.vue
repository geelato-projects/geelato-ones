<!--Todo模块的首页面-->
<script setup lang="ts">
// @ts-nocheck
import {computed, nextTick, ref, onMounted, onUpdated, toRaw} from "vue";
import GlList from '../../common/components/GlList.vue'
import {Task} from "../entity/Task";
import TaskForm from "./TaskForm.vue"
import TodoList from "./TodoList.vue"
import DaylyLog from "./DaylyLog.vue";
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
import {useTodoStore} from "../store/useTodoStore";
import GlSimpleEditor from "./detail/SimpleEditor.vue";

import List from "../entity/List";


const todoStore = useTodoStore()

const finishedTasks = ref()
const unfinishedTasks = ref()
const refreshFlag = ref(true)
const refreshDetail = () => {
  refreshFlag.value = false
  nextTick(() => {
    refreshFlag.value = true
  })
}
// ********** 小记 **********
const todayRecordHtml = ref('')
const todayRecordEditorStyle = ref({'min-height': '6em', 'height': '10em', 'max-height': '100%', 'overflow-y': 'auto'})
const saveDaylyLog = () => {
  console.log('todoStore.currentDaylyLog', todoStore.currentDaylyLog)
  todoStore.saveDaylyLog(toRaw(todoStore.currentDaylyLog))
}

// const detailWidth = ref(1100)
// const detailStyle = computed(() => {
//   return {'width': detailWidth.value + 'px'}
// })

const onFinishedTasksClick = (task: Task, index: number) => {
  unfinishedTasks.value.unselect();
  onTaskClick(task, index)
}
const onUnfinishedTasksClick = (task: Task, index: number) => {
  finishedTasks.value.unselect();
  onTaskClick(task, index)
}

const onTaskClick = (task: Task, index: number) => {
  todoStore.taskStore.setCurrentTask(task)
  refreshDetail()
}
const currentInput = ref('')

const addItem = () => {
  if (!currentInput.value) {
    return
  }
  todoStore.taskStore.addTask(currentInput.value)
  selectTask()
  currentInput.value = ''
  refreshDetail()
}

const deleteTask = (task: Task, index?: number) => {
  todoStore.taskStore.deleteTask(task.id)
  // 若删除的任务是收藏清单中，则需要刷新收藏列表
  if (task.star === 1) {
    todoStore.loadStarTasks()
  }
  todoStore.refreshCurrentList()
}

const setTaskExecutorId = (task: Task) => {
  // todoStore.taskStore.currentTask
}

const selectTask = () => {
  finishedTasks.value?.select(todoStore.taskStore.currentTask.id)
  unfinishedTasks.value?.select(todoStore.taskStore.currentTask.id)
}

const onFinishTask = (task: any) => {
  task.statusId = 'finished'
  todoStore.taskStore.updateTask(toRaw(task))
}
const onUnFinishTask = (task: any) => {
  task.statusId = 'unfinished'
  todoStore.taskStore.updateTask(toRaw(task))
}
const addTaskToStarList = (task: any) => {
  todoStore.addTaskToStarList(task)
}
const removeTaskFromStarList = (task: any) => {
  todoStore.removeTaskFromStarList(task)
}

const addTaskToTodayList = (task: any) => {
  todoStore.addTaskToTodayList(task)
}
const removeTaskFromTodayList = (task: any) => {
  todoStore.removeTaskFromTodayList(task)
}

onUpdated(() => {
  selectTask()
})


</script>

<template>
  <div class="gl-todo">
    <TodoList class="gl-todo-list"></TodoList>
    <div class="gl-todo-tasks gl-list" v-if="todoStore.currentList.title" :style="{height:$attrs.height+'px'}" style="padding-right: 0.5em">
      <template v-if="todoStore.currentListType===todoStore.ListTypes.DAYLYLOG">
        <DaylyLog></DaylyLog>
      </template>
      <template v-else>
        <!-- 提供今日小记功能-->
        <template v-if="todoStore.currentListType===todoStore.ListTypes.TODAY">
          <div>
            <span class="gl-title" style="display: inline-block">小记</span>
            <span class="gl-title" style="float: right;font-weight: 400">
            <a @click="saveDaylyLog">保存到日志</a>
          </span>
          </div>
          <div>
            <GlSimpleEditor ref="todayRecordEditor" :html="todoStore.currentDaylyLog.content"
                            @update="(html)=>{todoStore.currentDaylyLog.content=html}"
                            :editorStyle="todayRecordEditorStyle"
            ></GlSimpleEditor>
          </div>
        </template>
        <template v-if="todoStore.currentListType===todoStore.ListTypes.NORMAL">
          <div class="gl-title">添加任务</div>
          <div>
            <a-input v-model:value.trim="currentInput" style="width: 100%" placeholder="+ 添加任务到待整理，回车即可添加"
                     @keyup.enter="addItem"/>
          </div>
        </template>
        <div class="gl-title">未完成</div>
        <GlList ref="unfinishedTasks" :items="todoStore.unfinishedTasks"
                :showDelete="todoStore.currentListType===todoStore.ListTypes.NORMAL"
                @itemClick="onUnfinishedTasksClick" @deleteClick="deleteTask">
          <template #icon="iconProps">
            <span @click="onFinishTask(iconProps.item)"><span class="gl-circle"></span></span>
          </template>
          <template #title="titleProps">
            <span>{{ titleProps.item.title }}</span>
          </template>
          <template #extra="extraProps">
            <!-- 标为今天跟进 -->
            <span>
                <span v-if="!extraProps.item.today" class="gl-hidden gl-hover-as-inline-block gl-ignore-hidden"
                      @click="addTaskToTodayList(extraProps.item)" title="加入今天事项">
                <FieldTimeOutlined/>
              </span>
               <span v-if="extraProps.item.today" @click="removeTaskFromTodayList(extraProps.item)"
                     style="color:#ffba28"
                     class="gl-ignore-hidden" title="从今天事项移除">
                <FieldTimeOutlined/>
              </span>
            </span>
            <!-- 标星收藏 -->
            <span>
                <span v-if="!extraProps.item.star" class="gl-hidden gl-hover-as-inline-block gl-ignore-hidden"
                      @click="addTaskToStarList(extraProps.item)">
                <StarOutlined/>
              </span>
               <span v-if="extraProps.item.star" @click="removeTaskFromStarList(extraProps.item)" style="color:#ffba28"
                     class="gl-ignore-hidden">
                <StarFilled/>
              </span>
            </span>
          </template>
        </GlList>
        <div class="gl-title">已完成</div>
        <GlList ref="finishedTasks" :items="todoStore.finishedTasks" :showDelete="true"
                @itemClick="onFinishedTasksClick"
                @deleteClick="deleteTask">
          <template #icon="iconProps">
            <span @click="onUnFinishTask(iconProps.item)" class="gl-circle-checked"><CheckCircleOutlined/></span>
          </template>
          <template #title="titleProps">
            <span>{{ titleProps.item.title }}</span>
          </template>
          <template #extra="extraProps">
          <span v-if="!extraProps.item.star" class="gl-hidden gl-hover-as-inline-block"
                @click="addTaskToStarList(extraProps.item)">
              <StarOutlined/>
            </span>
            <span v-if="extraProps.item.star" @click="removeTaskFromStarList(extraProps.item)" style="color:#ffba28">
              <StarFilled/>
            </span>
          </template>
        </GlList>
      </template>
    </div>
    <div class="gl-todo-task-detail" :style="{width:'1000px',height:$attrs.height+'px'}"
         v-if="todoStore.currentTask&&todoStore.currentTask.id">
      <div class="gl-title">
        <a-space>
          <InfoCircleOutlined/>
          任务详情
        </a-space>
        <span style="float: right;margin-right: 12px">
          <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                <EllipsisOutlined style="font-size: 1.5em;line-height: 1.5em;padding-right: 0.2em"/>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="setTaskExecutorId(todoStore.taskStore.currentTask)"><EditOutlined/>&nbsp;设置参与人</a>
                  </a-menu-item>
                  <a-menu-item style="color: red">
                    <a @click="deleteTask(todoStore.taskStore.currentTask)"><DeleteOutlined/>&nbsp;删除任务</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
        </span>
      </div>
      <TaskForm v-model:task="todoStore.currentTask" v-if="refreshFlag" style="width: 98%"></TaskForm>
    </div>
  </div>
</template>

<style>
.gl-todo {
  display: flex;
}

.gl-todo-list {
  min-width: 250px;
  width: 250px;
}

.gl-todo-tasks {
  margin: 0 2em;
  width: 100%;
  overflow-y: auto;
}

.gl-todo-task-detail {
  overflow-y: auto;
}

.gl-todo-task-detail > .gl-title {
  font-weight: 600;
  padding: 1.2em 0;
}


</style>
