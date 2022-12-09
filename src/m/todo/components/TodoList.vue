<script setup lang="ts">
import {VueDraggableNext} from 'vue-draggable-next'
import {
  StarOutlined,
  FieldTimeOutlined,
  CheckSquareOutlined,
  PlusOutlined,
  ExportOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined
} from "@ant-design/icons-vue";
import {ref, unref} from "vue";
import List from "../entity/List"
import {useTodoStore} from "../store/useTodoStore";
import utils from "../../common/utils/Utils";

const emit = defineEmits(['onSetCurrentList'])
const todoStore = useTodoStore()
const ListTypes = todoStore.ListTypes
const currentSelectedItemKey = ref('')
const listFormVisible = ref(false)
const addList = () => {
  listFormVisible.value = true
}
const defaultListColor = '#FFC397'
const formState = ref(new List().setColor(defaultListColor))
const listColors = ['#FFC397', '#FFA998', '#18ACBA', '#F76566', '#6184C6', '#FCA3B9', '#F21137']
const saveList = () => {
  if (!formState.value.title || !formState.value.color) {
    return
  }
  const newList = JSON.parse(JSON.stringify(formState.value))
  if (formState.value.id) {
    todoStore.updateList(newList)
  } else {
    todoStore.addList(newList)
  }
  listFormVisible.value = false
  currentSelectedItemKey.value = formState.value.id
  formState.value = new List().setColor(defaultListColor)
}
const onCancelListForm = () => {
  formState.value = new List().setColor(defaultListColor)
}
const showEditTaskForm = (list: List) => {
  formState.value = JSON.parse(JSON.stringify(list))
  listFormVisible.value = true
}
const deleteList = (list: List) => {
  todoStore.deleteList(list.id)
}
const updateListOrder = () => {
  todoStore.updateLists(JSON.parse(JSON.stringify(todoStore.lists)))
}
const onSelectListItem = async (list: List, listType: string) => {
  // console.log('onSelectListItem:', list)
  currentSelectedItemKey.value = list.id
  todoStore.setCurrentList(list, listType)
  if(listType===ListTypes.TODAY){
    await todoStore.loadDaylyLog()
  }
  emit('onSetCurrentList', list, listType)
}

const onSelectSpecialListItem = (listType: string) => {
  currentSelectedItemKey.value = listType
  todoStore.setCurrentListType(listType)
}

const exportTodoData = () => {
  todoStore.exportData().then((data) => {
    if (data) {
      utils.downloadFile(JSON.stringify(data), 'todo.json')
    }
  })

}

const badgeStyle = {backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}
</script>

<template>
  <div class="gl-todo-list">
    <div class="gl-segment-start"></div>
    <div class="gl-segment-main">
      <div class="gl-item" @click="onSelectListItem(todoStore.allList,ListTypes.ALL)"
           :class="{'gl-selected':currentSelectedItemKey===ListTypes.ALL}">
        <span class="gl-icon"><CheckSquareOutlined/></span>
        <span class="gl-title">全部事项</span>
        <span class="gl-extra">
         <a-badge title="" :count="0" :number-style="badgeStyle"/>
          </span>
      </div>
      <div class="gl-item" @click="onSelectListItem(todoStore.starList,ListTypes.STAR)"
           :class="{'gl-selected':currentSelectedItemKey===ListTypes.STAR}">
        <span class="gl-icon"><StarOutlined/></span>
        <span class="gl-title">收藏事项</span>
        <span class="gl-extra">
       <a-badge title="" :count="todoStore.starTasks.length" :number-style="badgeStyle"/>
          </span>
      </div>
      <div class="gl-item" @click="onSelectListItem(todoStore.todayList,ListTypes.TODAY)"
           :class="{'gl-selected':currentSelectedItemKey===ListTypes.TODAY}">
        <span class="gl-icon"><FieldTimeOutlined/></span>
        <span class="gl-title">今天事项</span>
        <span class="gl-extra">
             <a-badge title="" :count="todoStore.todayTasks.length" :number-style="badgeStyle"/>
          </span>
      </div>
      <div class="gl-item" @click="onSelectListItem(todoStore.daylyLogList,ListTypes.DAYLYLOG)"
           :class="{'gl-selected':currentSelectedItemKey===ListTypes.DAYLYLOG}">
        <span class="gl-icon"><EditOutlined/></span>
        <span class="gl-title">日志记录</span>
        <span class="gl-extra">
<!--             <a-badge title="" :count="todoStore.recordTasks.length" :number-style="badgeStyle"/>-->
          </span>
      </div>
      <div class="gl-item gl-header">
        <span class="gl-title">清单</span>
        <span class="gl-extra">
          <ExportOutlined @click="exportTodoData" title="导出清单" style="margin-right: 1em"/>
          <PlusCircleOutlined @click="addList" title="创建清单"/>
        </span>
      </div>
      <VueDraggableNext
          :list="todoStore.lists"
          animation="700"
          @change="updateListOrder"
      >
        <div class="gl-item gl-item-dnd-handle" @click="onSelectListItem(element,ListTypes.NORMAL)"
             :class="{'gl-selected':currentSelectedItemKey===element.id}" v-for="element in todoStore.lists">
          <span class="gl-icon" style="font-size: 1.2em" :style="{color:element.color}">●</span>
          <span class="gl-title">{{ element.title }}</span>
          <span class="gl-extra gl-todo-list-item">
            <!--  <a-badge title="" :count="1" :number-style="badgeStyle"/>-->
              <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                <EllipsisOutlined style="font-size: 1.5em;line-height: 1.5em;padding-right: 0.2em"/>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="showEditTaskForm(element)"><EditOutlined/>&nbsp;编辑清单</a>
                  </a-menu-item>
                  <a-menu-item style="color: red">
                    <a @click="deleteList(element)"><DeleteOutlined/>&nbsp;删除清单</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            </span>
        </div>
      </VueDraggableNext>
    </div>
    <!--    <div class="gl-segment-end">-->
    <!--      <a-button size="small" block>设置</a-button>-->
    <!--    </div>-->
    <a-modal v-model:visible="listFormVisible" title="清单信息" @cancel="onCancelListForm">
      <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 21 }"
          autocomplete="off"
      >
        <a-form-item label="清单颜色" name="color">
          <div class="gl-list-color-selector">
            <span :style="{'background-color':color}" v-for="color in listColors" @click="formState.color=color"
                  :class="{'gl-selected':formState.color===color}"><span v-if="formState.color===color">●</span></span>
          </div>
        </a-form-item>
        <a-form-item label="清单名称" name="title">
          <a-input v-model:value="formState.title" @keyup.enter="saveList"/>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" :disabled="!formState.title||!formState.color" @click="saveList">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped>
.gl-todo-list {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  /*布局方向是垂直的*/
  flex-direction: column;
  height: 100%;
}

.gl-segment-start {
}

.gl-segment-main {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 100%;
  overflow-y: auto;
}

.gl-segment-end {
  height: 50px;
}

.gl-todo-list .gl-item {
  line-height: 2em;
  margin: 8px;
  padding: 6px;
  border-radius: 10px;
  user-select: none;
}

.gl-todo-list .gl-item:not(.gl-header):hover, .gl-todo-list .gl-item.gl-selected {
  background-color: var(--gl_nav_gray);
  cursor: pointer;
}

.gl-todo-list .gl-item .gl-icon {
  margin: 0 12px;
}

.gl-todo-list .gl-item .gl-extra {
  float: right;
}

.gl-todo-list .gl-item .gl-title {
  margin: 0 12px 0 0;
}

.gl-item.gl-header .gl-extra {
  display: none;
}

.gl-item.gl-header:hover .gl-extra {
  display: block;
  cursor: pointer;
  margin-right: 8px;

}

/*.gl-list-color-selector > span {*/
/*display: inline-block;*/
/*text-align: center;*/
/*width: 28px;*/
/*height: 28px;*/
/*border-radius:50%;*/
/*}*/
.gl-list-color-selector > span {
  display: inline-block;
  user-select: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  margin: 0 4px;
}

.gl-list-color-selector > span > span {
  color: white;
}

.gl-item:hover .gl-extra.gl-todo-list-item .ant-badge {
  display: none;
}

.gl-item:hover .gl-extra.gl-todo-list-item .ant-dropdown-link {
  display: block;
}

.gl-item .gl-extra.gl-todo-list-item .ant-dropdown-link {
  display: none;
}

/*
 *  STYLE 3
 */

#style-3::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #F5F5F5;
}

#style-3::-webkit-scrollbar {
  width: 6px;
  background-color: #F5F5F5;
}

#style-3::-webkit-scrollbar-thumb {
  background-color: #000000;
}


</style>
