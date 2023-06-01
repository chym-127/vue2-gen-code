<template>
  <div class="json-edit-box">
    <slot></slot>
    <div class="format-btn" @click="jsonFormat">
      <span>格式化</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  content: String,
});

const emit = defineEmits<{
  (e: 'output', value: string): void
}>()

function jsonFormat() {
  let temp = JSON.parse(props.content!);
  emit("output",JSON.stringify(temp, null, 4));
}
</script>

<style lang="less" scoped>
.json-edit-box {
  position: relative;
  .format-btn {
    padding: 4px;
    border-radius: 8px;
    position: absolute;
    right: 20px;
    top: 6px;
    background-color: #f0f0f0;
    color: #000;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
