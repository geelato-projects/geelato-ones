<script setup lang="ts">

import {ref} from "vue";

const emit = defineEmits(["update"])
const props = defineProps({
  imageBase64: {
    type: String
  },
  width: {
    type: String,
    default() {
      return '100px'
    }
  },
  height: {
    type: String,
    default() {
      return '100px'
    }
  },
  kindAllow: {
    type: Array,
    default() {
      return ['file']
    }
  }
})
const glPasteArea = ref()

const onPaste = (e: ClipboardEvent) => {
  // console.log('glAppIconPasteArea', e, glPasteArea.value, glPasteArea.value.children)
  // const items = e.clipboardData?.items
  // let isImage = false
  // for (let itemsKey in items) {
  //   // @ts-ignore
  //   const item = items[itemsKey]
  //   if (props.kindAllow?.indexOf(item.kind) !== -1 && item.type.indexOf('image/') !== -1) {
  //     isImage = true
  //     while (glPasteArea.value.children.length > 0) {
  //       glPasteArea.value.removeChild()
  //     }
  //   }
  // }
}

const getFirstImageAsBase64 = () => {
  let ary: Array<any> = glPasteArea.value.children
  for (let key in ary) {
    console.log('ary[key]:', ary[key], ary[key].nodeName, ary[key].nodeName === 'IMG')
    if (ary[key].nodeName === 'IMG') {
      console.log('src:', ary[key].src)
      return ary[key].src
    }
  }
}

defineExpose({getFirstImageAsBase64})


</script>

<template>
  <div class="glPasteArea" ref="glPasteArea" contenteditable="true" @paste="onPaste" :style="{width:width,height:height}">
    <img v-if="imageBase64" :src="imageBase64">
  </div>
</template>

<style scoped>
  .glPasteArea{
    overflow: hidden;
    border: 1px solid #d7d6d6
  }
  .glPasteArea:hover{
    border: 1px solid #41a4fc
  }
  .glPasteArea:focus{
    border: 1px solid #41a4fc
  }
</style>
