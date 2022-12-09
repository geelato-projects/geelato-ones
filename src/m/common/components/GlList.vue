<script setup lang="ts">
// @ts-nocheck
import {DeleteOutlined} from "@ant-design/icons-vue";
import {ref, toRaw} from "vue";

const emit = defineEmits(['iconClick', 'titleClick', 'itemClick', 'deleteClick'])
const props = defineProps({
  items: Array,
  showDelete: {
    type: Boolean,
    default() {
      return false
    }
  }
})

const currentItemId = ref('')

const onDeleteClick = (item: any, index: number) => {
  props.items?.splice(index, 1)
  emit('deleteClick', toRaw(item), index)
}

const onItemClick = (item: any, index: number) => {
  currentItemId.value = item.id
  emit('itemClick', toRaw(item), index)
}

const unselect = () => {
  currentItemId.value = ''
}

const select = (id: string) => {
  currentItemId.value = id
}

defineExpose({select, unselect})
</script>

<template>
  <div class="gl-list">
    <div class="gl-items">
      <template v-for="(item,index) in items">
        <div class="gl-item" @click="onItemClick(item,index)" :class="{'gl-selected':currentItemId===item.id}">
          <div class="gl-icon" @click="emit('iconClick')">
            <slot name="icon" :item="item" :index="index"/>
          </div>
          <div class="gl-title" @click="emit('titleClick')">
            <slot name="title" :item="item" :index="index"/>
          </div>
          <div class="gl-extra">
            <slot name="extra" :item="item" :index="index"/>
            <span class="gl-extra-delete" v-if="showDelete" @click="onDeleteClick(item,index)"
                  style="color: red">
                <DeleteOutlined/>
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>
