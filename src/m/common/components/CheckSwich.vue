<script setup lang="ts">
import {CheckCircleOutlined} from "@ant-design/icons-vue";
import {ref, toRaw} from "vue";

const props = defineProps({
  checked: Boolean
})

const emit = defineEmits(['change'])

const checkState = ref(props.checked ? true : false)
const change = () => {
  checkState.value = !checkState.value
  emit('change', toRaw(checkState.value))
}
</script>

<template>
  <span @click="change">
    <span v-if="checked" class="gl-circle-checked" style="padding: 1px 0 0 0;display: inline-block"><CheckCircleOutlined/></span>
    <span v-else><span class="gl-circle"></span></span>
  </span>
</template>

<style scoped>

</style>
