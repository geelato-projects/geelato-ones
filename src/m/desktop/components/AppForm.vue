<script setup lang="ts">

import {onMounted, reactive, ref, toRaw, unref} from "vue";
import {Form} from 'ant-design-vue';
import utils from "../../common/utils/Utils";
import {App} from "../entity/App";
import PasteArea from "../../common/components/PasteArea.vue";
import {useAppStore} from "../store/useAppStore";

const appStore = useAppStore()
const appFormVisible = ref(false)
const glAppIconPasteArea = ref()
const modelRef = ref(new App());
const rulesRef = ref({
  name: [
    {
      required: true,
      message: '请输入名称',
    },
  ],
  // base64
  iconSrc: [],
  index: [
    {
      required: true,
      message: '请输入地址'
    },
  ],
  target: [
    {
      required: true,
      message: '请选择打开窗口目标'
    },
  ],
});
const {resetFields, validate, validateInfos} = Form.useForm(modelRef, rulesRef, {
  onValidate: (...args) => console.log(...args),
});
const onSubmit = () => {
  validate()
      .then(() => {
        modelRef.value.iconSrc = glAppIconPasteArea.value.getFirstImageAsBase64()
        console.log('toRaw(modelRef)', toRaw(modelRef));
        appStore.add(toRaw(modelRef.value)).then(() => {
          resetFields()
          appFormVisible.value = false
        })
      })
      .catch(err => {
        console.log('error', err);
      });
};


const onFinish = () => {
}
const openModal = () => {
  appFormVisible.value = true
}
const onPaste = (e: ClipboardEvent) => {
  console.log('glAppIconPasteArea', glAppIconPasteArea.value.children.length)
  const items = e.clipboardData?.items
  for (let itemsKey in items) {
    // @ts-ignore
    const item = items[itemsKey]
    if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
      console.log(item)
    }
  }

}
defineExpose({openModal})
</script>

<template>
  <div>
    <a-modal v-model:visible="appFormVisible" title="应用信息" @ok="onSubmit">
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="名称" v-bind="validateInfos.name">
          <a-input v-model:value="modelRef.name"/>
        </a-form-item>
        <a-form-item label="应用地址" v-bind="validateInfos.index">
          <a-input v-model:value="modelRef.index"/>
        </a-form-item>
        <a-form-item label="打开方式" v-bind="validateInfos.target">
          <a-select ref="select" v-model:value="modelRef.target" style="width: 100%">
            <a-select-option value="_self">主窗口</a-select-option>
            <a-select-option value="_blank">新窗口</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="图标" >
          <a-form-item label="图标贴图">
            <PasteArea ref="glAppIconPasteArea" :image-base64="modelRef.iconSrc"></PasteArea>
            将复制的图标贴在以上方块区域
          </a-form-item>
          <a-form-item label="图标名称">
            <a-input v-model:value="modelRef.iconName"/>
          </a-form-item>
        </a-form-item>
        <a-form-item label="描述" name="description" v-bind="validateInfos.description">
          <a-textarea row="5" v-model:value="modelRef.description"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>

</style>
