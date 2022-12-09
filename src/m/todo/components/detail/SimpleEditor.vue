<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import {onBeforeUnmount, ref, shallowRef, onMounted} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {IDomEditor} from "@wangeditor/editor";

const emit = defineEmits(['update', 'change'])
const props = defineProps({
  html: {
    type: String,
    default() {
      return ''
    }
  },
  // 初始化时是否自动focus
  autoFocus: {
    type: Boolean,
    default() {
      return false
    }
  },
  editorStyle: {
    type: Object,
    default() {
      return {}
    }
  }
})
// default | simple
const mode = 'simple'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

console.log('props:', props.html)
// 内容 HTML
const valueHtml = ref(props.html)

// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //   valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
  // }, 1500)
})

const toolbarConfig = {
  // 最简洁的格式，去掉所有的工具按钮
  toolbarKeys: []
}
const editorConfig = {
  placeholder: '',
  MENU_CONF: {
    uploadImage: {
      // 小于该值就插入 base64 格式（而不上传），默认为 0
      base64LimitSize: 5000 * 1024, // 5kb
    }
  },
  autoFocus: props.autoFocus
}

const onEditorClick = () => {
  editorRef.value.focus()
}
const onChange = (editor: IDomEditor) => {
  const html = editor.getHtml()
  if (html === '<p><br></p>') {
    // 清掉editor，默认的空内容
    emit('change', '')
  } else {
    emit('change', html)
  }
}
const onBlur = (editor: IDomEditor) => {
  const html = editor.getHtml()
  if (html === '<p><br></p>') {
    // 清掉editor，默认的空内容
    emit('update', '')
  } else {
    emit('update', html)
  }
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const focus = () => {
  const editor = editorRef.value
  if (editor == null) return
  editor.focus()
}

const setHtml = (html:string) => {
  const editor = editorRef.value
  if (editor == null) return
  editor.setHtml(html)
}

defineExpose({focus,setHtml})

</script>

<template>
  <div class="gl-simple-editor">
    <Toolbar
        style="border-bottom: 0px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor :style="editorStyle"
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
            @onChange="onChange"
            @onBlur="onBlur"
            @click="onEditorClick"
    />
  </div>
</template>

<style scoped>
.gl-simple-editor {
  border: 1px solid #ccc
}

.gl-simple-editor:hover {
  border: 1px solid #41a4fc
}

.gl-simple-editor .w-e-text-container [data-slate-editor] p {
  margin: 2px 0;
}

</style>
