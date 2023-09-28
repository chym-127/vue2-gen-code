<template>
  <div>
    <div style="margin-bottom: 12px">
      <a-button type="primary" @click="openDrawer(resetFormState)">新建文件模板</a-button>
    </div>
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, text, record }: any">
        <template v-if="column.dataIndex === 'name'">
          <span>{{ text }}</span>
        </template>

        <template v-if="column.dataIndex === 'options'">
          <a-tag v-for="val in record.options" style="margin-top: 6px" :key="val" :color="'geekblue'">
            {{ val.value }}
          </a-tag>
        </template>

        <template v-if="column.dataIndex === 'content'">
          <span>{{ text }}</span>
        </template>

        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" @click="openDrawer(record)">编辑</a-button>
          <a-divider type="vertical"></a-divider>
          <a-button type="link" @click="handleDel(record)">删除</a-button>
        </template>
      </template>
    </a-table>

    <a-drawer
      :width="800"
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

        <a-form-item label="字段">
          <div style="background-color: #f9f9f9; padding: 12px 24px">
            <div>
              <a-button type="link" style="padding: 4px 0px; color: #1890ffbb" @click="addOption">新增</a-button>
            </div>
            <div class="option-item flex-row" v-for="(option, index) in formState.options" :key="index">
              <a-input v-model:value="option.value" placeholder="VALUE"></a-input>
              <div class="del-option_btn" @click="delOption(index)">
                <img src="../../../assets/del.png" style="width: 16px; height: 16px" alt="" srcset="" />
              </div>
            </div>
          </div>
        </a-form-item>

        <a-form-item label="内容" name="content">
          <a-textarea :rows="20" v-model:value="formState.content" placeholder="请输入内容" />
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
import { Modal } from 'ant-design-vue';
import { holdResponse } from '../../../utils/index';
let data = reactive([]);
const visible = ref(false);
const placement = ref('right');

const formRef = ref<FormInstance>();
const formState = reactive<any>({
  id: '',
  name: '',
  options: [
    {
      value: '',
    },
  ],
  content: '',
});
const resetFormState = {
  id: '',
  name: '',
  options: [
    {
      value: '',
    },
  ],
  content: '',
};
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '', trigger: 'change' }],
  attributes: [{ required: true, message: '', trigger: 'change' }],
  content: [{ required: true, message: '', trigger: 'change' }],
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 160,
  },
  {
    title: '属性',
    dataIndex: 'options',
    key: 'options',
    width: 200,
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
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
    invoke('handle_update_teamlate', {
      t: data,
    }).then((resp: any) => {
      if (holdResponse(resp)) {
        handleListTeamlate();
        visible.value = false;
      }
    });
  } else {
    invoke('handle_create_teamlate', {
      t: data,
    }).then((resp: any) => {
      if (holdResponse(resp)) {
        handleListTeamlate();
        visible.value = false;
      }
    });
  }
}

function handleDel(row: any) {
  Modal.confirm({
    title: '确认',
    content: '确认删除该记录吗',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      invoke('handle_del_teamlate', {
        id: row.id,
      }).then((resp: any) => {
        console.log('删除成功');
        init();
      });
    },
  });
}

function handleListTeamlate() {
  invoke('handle_list_teamlate', {
    req: {
      page_size: 10,
      page_num: 1,
    },
  }).then((resp: any) => {
    resp.data.forEach((item: any) => {
      item.options = JSON.parse(item.attributes);
    });
    data.splice(0);
    Object.assign(data, resp.data);
  });
}

// 新建或编辑确认
function onClose() {
  visible.value = false;
}

function openDrawer(row: any) {
  visible.value = true;
  Object.assign(formState, {
    id: row.id,
    name: row.name,
    content: row.content,
    options: JSON.parse(JSON.stringify(row.options)),
  });
}

const submitForm = () => {
  let validate = formRef.value?.validateFields();
  if (validate) {
    handleCreateOrUpdate({
      id: formState.id || null,
      name: formState.name,
      attributes: JSON.stringify(formState.options),
      content: formState.content,
    });
  }
};

const clearValidate = () => {
  formRef.value?.clearValidate();
};

const addOption = () => {
  formState.options.push({
    key: '',
    value: '',
  });
};

const delOption = (idx: number) => {
  formState.options.splice(idx, 1);
};

function init() {
  handleListTeamlate();
}

init();

defineExpose({
  init,
});
</script>

<style lang="less" scoped>
.option-item {
  margin-bottom: 12px;
  gap: 12px;

  .del-option_btn {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
