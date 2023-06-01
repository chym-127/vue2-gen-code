<template>
  <div class="container">
    <a-tabs v-model:activeKey="activeKey" @change="tabChange">
      <a-tab-pane :key="1" tab="生成代码" force-render>
        <Output ref="OutputRef"></Output>
      </a-tab-pane>
      <a-tab-pane :key="2" tab="文件模板管理"  force-render>
        <Template ref="TemplateRef"></Template>
      </a-tab-pane>
      <a-tab-pane :key="3" tab="渲染器管理" force-render>
        <Renderer ref="RendererRef"></Renderer>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import Template from './template/index.vue';
import Renderer from './renderer/index.vue';
import Output from './output/index.vue';
interface InstanceProps {
  init: () => {};
}

import { ref } from 'vue';

const activeKey = ref(1);

const TemplateRef = ref<InstanceProps>();
const RendererRef = ref<InstanceProps>();
const OutputRef = ref<InstanceProps>();

function tabChange(val: any) {
  switch (val) {
    case 1:
      TemplateRef.value!.init();
      break;
    case 2:
      RendererRef.value!.init();
      break;
    case 3:
      OutputRef.value!.init();
      break;
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 0 24px;
}
</style>
