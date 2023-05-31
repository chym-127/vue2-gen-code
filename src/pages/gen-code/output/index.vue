<template>
  <div>
    <div style="margin-bottom: 12px" class="flex-row justify-space-between">
      <div class="flex-row" style="align-items: center">
        <span style="width: 70px">选择模板:</span>
        <a-select
          ref="select"
          allowClear
          placeholder="请选择模板"
          v-model:value="templateId"
          @change="templateChange"
          style="width: 200px"
        >
          <a-select-option :value="template.id" v-for="(template, index) in templateList" :key="index">
            {{ template.name }}
          </a-select-option>
        </a-select>
      </div>
      <div>
        <a-button type="primary" style="margin-left: 8px" @click="openDrawer(resetFormState)">新建字段</a-button>
      </div>
    </div>
    <a-table :columns="columns" :data-source="tebleList" :scroll="{y:500}" :pagination="false">
      <template #bodyCell="{ column, text, record }: any">
        <template v-if="column.dataIndex === 'name'">
          <span>{{ text }}</span>
        </template>

        <template v-if="column.dataIndex === 'type'">
          <span>{{ text }}</span>
        </template>

        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" @click="openDrawer(record)">编辑</a-button>
          <a-divider type="vertical"></a-divider>
          <a-button type="link" @click="handleDel(record)">删除</a-button>
        </template>
      </template>
    </a-table>

    <div class="flex-row" style="justify-content: flex-end;margin-top: 10px;">
      <a-button type="primary" @click="outputCode">生成代码</a-button>
    </div>

    <a-drawer
      :width="600"
      :title="formState.id ? '编辑' : '创建'"
      :placement="placement"
      :visible="visible"
      @close="onClose"
    >
      <template #extra>
        <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
        <a-button type="primary" @click="submitForm">确认</a-button>
      </template>
      <a-form ref="formRef" name="custom-validation" :model="formState" :rules="rules" v-bind="layout">
        <a-form-item label="名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入标题" autocomplete="off" />
        </a-form-item>
        <a-form-item label="字段名" name="fieldName">
          <a-input v-model:value="formState.fieldName" placeholder="请输入字段名" autocomplete="off" />
        </a-form-item>
        <a-form-item label="类型" name="type">
          <a-select ref="select" allowClear placeholder="请选择类型" v-model:value="formState.type" style="width: 100%">
            <a-select-option :value="type.key" v-for="(type, index) in typeList" :key="index">
              {{ type.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="渲染器" name="rendererId">
          <a-select
            ref="select"
            allowClear
            placeholder="请选择渲染器"
            v-model:value="formState.rendererId"
            @change="rendererChange"
            style="width: 100%"
          >
            <a-select-option :value="renderer.id" v-for="(renderer, index) in rendererList" :key="index">
              {{ renderer.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="HTML渲染字段">
          <a-select
            ref="select"
            allowClear
            placeholder="请选择HTML渲染字段"
            v-model:value="formState.htmlField"
            style="width: 100%"
          >
            <a-select-option :value="field.value" v-for="(field, index) in currentTemp.options" :key="index">
              {{ field.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="拓展属性">
          <a-textarea :rows="8" v-model:value="formState.expand" placeholder="请输入内容" />
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import { invoke } from '@tauri-apps/api/tauri';
import { reactive, ref } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from 'ant-design-vue';
import { genCode } from '.';
const tebleList = reactive<any>([]);
const visible = ref(false);
const placement = ref('right');
const templateId = ref();
const formRef = ref<FormInstance>();
const formState = reactive<any>({
  id: '',
  name: '',
  fieldName: '',
  htmlField: '',
  rendererId: '',
  type: '',
  expand: '',
});

const fields = reactive([
  {
    key: 'html',
    val: '',
  },
  {
    key: 'css',
    val: '',
  },
  {
    key: 'data',
    val: '',
  },
  {
    key: 'methods',
    val: '',
  },
]);

const typeList = reactive([
  {
    key: 1,
    label: 'Number',
  },
  {
    key: 2,
    label: 'String',
  },
]);

const resetFormState = {
  id: '',
  name: '',
  fieldName: '',
  htmlField: '',
  rendererId: '',
  type: '',
  expand: '',
};
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入名称', trigger: 'change' }],
  fieldName: [{ required: true, message: '请输入字段名', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  rendererId: [{ required: true, message: '请选择渲染器', trigger: 'change' }],
};
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 160,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '拓展属性',
    dataIndex: 'expand',
    key: 'expand',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 180,
    key: 'action',
  },
];

function handleCreateOrUpdate(data: any) {
  if (data.id) {
    current = Object.assign(current, data);
  } else {
    data.id = uuidv4();
    tebleList.push(data);
  }
  visible.value = false;
  localStorage.setItem('FIELD_LIST', JSON.stringify(tebleList));
}

function handleDel(row: any) {
  Modal.confirm({
    title: '确认',
    content: '确认删除该记录吗',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      tebleList.forEach((item: any, index: any) => {
        if (item.id === row.id) {
          tebleList.splice(index, 1);
          localStorage.setItem('FIELD_LIST', JSON.stringify(tebleList));
          return;
        }
      });
    },
  });
}

// 新建或编辑确认
function onClose() {
  visible.value = false;
}

let current = reactive<any>({});
function openDrawer(row: any) {
  current = row;
  visible.value = true;
  Object.assign(formState, {
    id: row.id,
    name: row.name,
    rendererId: row.rendererId,
    htmlField: row.htmlField,
    fieldName: row.fieldName,
    type: row.type,
    expand: row.expand,
  });
}

const submitForm = () => {
  formRef.value
    ?.validateFields()
    .then((validate) => {
      if (validate) {
        handleCreateOrUpdate({
          id: formState.id || null,
          name: formState.name,
          fieldName: formState.fieldName,
          htmlField: formState.htmlField,
          rendererId: formState.rendererId,
          type: formState.type,
          expand: formState.expand,
        });
      }
    })
    .catch(() => {});
};

const clearValidate = () => {
  formRef.value?.clearValidate();
};

function rendererChange(val: any) {
  formState.expand = rendererMapper[val].additional;
}

const templateList: any[] = reactive([]);
function handleListTeamlate() {
  invoke('handle_list_teamlate', {
    req: {
      page_size: 10000,
      page_num: 1,
    },
  }).then((resp: any) => {
    resp.data.forEach((item: any) => {
      item.options = JSON.parse(item.attributes);
    });
    Object.assign(templateList, resp.data);
  });
}

const rendererList: any[] = [];
const rendererMapper: {
  [key: number]: any;
} = {};

function handleListRenderer() {
  invoke('handle_list_renderer', {
    req: {
      page_size: 10000,
      page_num: 1,
    },
  }).then((resp: any) => {
    resp.data.items.forEach((item: any) => {
      item.fields = JSON.parse(item.content);
    });
    Object.assign(rendererList, resp.data.items);
    rendererList.forEach((renderer) => {
      let renders: { [key: string]: any } = {};
      renderer.fields.forEach((item: any) => {
        renders[item.key] = item.val;
      });
      rendererMapper[renderer.id] = { ...renderer, renders };
    });
  });
}

const currentTemp = reactive({
  id: '',
  name: '',
  options: [
    {
      value: '',
    },
  ],
  content: '',
});
function templateChange(val: any, option: any) {
  const obj = templateList.find((item) => {
    return item.id === val;
  });
  Object.assign(currentTemp, obj);
  console.log('currentTemp', currentTemp, val);

  localStorage.setItem('TEMPLATE_ID', templateId.value);
}

function outputCode() {
  genCode(currentTemp, tebleList, rendererMapper);
}

function init() {
  handleListTeamlate();
  handleListRenderer();
}

init();
let list = localStorage.getItem('FIELD_LIST');
let TEMPLATE_ID = localStorage.getItem('TEMPLATE_ID');
if (list) {
  Object.assign(tebleList, JSON.parse(list));
}
if (TEMPLATE_ID) {
  templateId.value = Number(TEMPLATE_ID);
  setTimeout(() => {
    const obj = templateList.find((item) => {
      return item.id === templateId.value;
    });
    Object.assign(currentTemp, obj);
  }, 100);
}
defineExpose({
  init,
});
</script>

<style lang="less" scoped>
.field-item {
  margin-bottom: 12px;
  gap: 12px;
  .field-item_title {
    width: 60px;
    text-align: right;
  }

  .field-item_content {
    width: 100%;
  }
}
</style>
