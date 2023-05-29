<template>
  <div>
    <div style="margin-bottom: 12px">
      <a-button type="primary" @click="openDrawer(resetFormState)">新建渲染器</a-button>
    </div>
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, text, record }: any">
        <template v-if="column.dataIndex === 'name'">
          <span>{{ text }}</span>
        </template>

        <!-- <template v-if="column.dataIndex === 'options'">
          <a-tag v-for="val in record.options" :key="val" :color="'geekblue'">
            {{ val.value }}
          </a-tag>
        </template> -->

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
      width="60vw"
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
        <a-form-item label="模板">
          <a-select
            ref="select"
            allowClear
            placeholder="请选择模板"
            v-model:value="formState.teamlate_id"
            style="width: 100%"
          >
            <a-select-option :value="template.id" v-for="(template, index) in teamlateList" :key="index">
              {{ template.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="额外属性">
          <a-textarea :rows="8" v-model:value="formState.additional" placeholder="请输入额外属性" />
        </a-form-item>
        <a-form-item label="内容">
          <div style="background-color: #f9f9f9; padding: 12px 24px">
            <div class="field-item flex-row" v-for="(field, index) in fields" :key="index">
              <div class="field-item_title">
                <span>{{ field.key }}</span>
              </div>
              <div class="field-item_content">
                <a-textarea :rows="8" v-model:value="field.val" placeholder="请输入内容" />
              </div>
            </div>
          </div>
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
import { holdResponse } from '../../../utils/index';
import { Modal } from 'ant-design-vue';

const data = reactive([]);
const visible = ref(false);
const placement = ref('right');

const formRef = ref<FormInstance>();
const formState = reactive<any>({
  id: '',
  name: '',
  fields: [
    {
      key: '',
      val: '',
    },
  ],
  additional: '',
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

const resetFormState = {
  id: '',
  name: '',
  fields: [
    {
      key: '',
      val: '',
    },
  ],
  additional: '',
};
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '', trigger: 'change' }],
};
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 21 },
};
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 160,
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
    invoke('handle_update_renderer', {
      t: data,
    }).then((resp: any) => {
      if (holdResponse(resp)) {
        init();
        visible.value = false;
      }
    });
  } else {
    invoke('handle_create_renderer', {
      t: data,
    }).then((resp: any) => {
      if (holdResponse(resp)) {
        init();
        visible.value = false;
      }
    });
  }
}

function handleListRenderer() {
  invoke('handle_list_renderer', {
    req: {
      page_size: 10,
      page_num: 1,
    },
  }).then((resp: any) => {
    resp.data.forEach((item: any) => {
      item.fields = item.content ? JSON.parse(item.content) : null;
    });
    data.splice(0);
    Object.assign(data, resp.data);
  });
}

function handleDel(row: any) {
  Modal.confirm({
    title: '确认',
    content: '确认删除该记录吗',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      invoke('handle_del_renderer', {
        id: row.id,
      }).then((resp: any) => {
        console.log("删除成功");
        init();
      });
    },
  });
}

// 新建或编辑确认
function onClose() {
  visible.value = false;
}

function openDrawer(row: any) {
  visible.value = true;
  fields.forEach((field, index) => {
    field.val = row.fields?.[index]?.val || '';
  });
  Object.assign(formState, {
    id: row.id,
    name: row.name,
    teamlate_id: row.teamlate_id,
    additional: row.additional,
  });
}

const submitForm = () => {
  let validate = formRef.value?.validateFields();
  let content = JSON.stringify(fields);
  if (validate) {
    handleCreateOrUpdate({
      id: formState.id || null,
      name: formState.name,
      teamlate_id: formState.teamlate_id,
      content: content,
      additional: formState.additional,
    });
  }
};

const clearValidate = () => {
  formRef.value?.clearValidate();
};

const teamlateList: any[] = [];
function handleListTeamlate() {
  invoke('handle_list_teamlate', {
    req: {
      page_size: 10,
      page_num: 1,
    },
  }).then((resp: any) => {
    Object.assign(teamlateList, resp.data);
  });
}

function init() {
  handleListTeamlate();
  handleListRenderer();
}

init();

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
