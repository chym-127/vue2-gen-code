<template>
  <div>
    <div class="header">
      <h3>配置表格字段</h3>
      <a-button type="primary" @click="addColumn()" style="margin-left: 12px">新增字段</a-button>
    </div>
    <div class="p-8" style="display: flex; justify-content: flex-end">
      <span>操作：</span>
      <a-checkbox-group v-model:value="checkedActionList" :options="actionOptions" />
    </div>
    <div>
      <a-table :columns="columns" :data-source="columnList" :pagination="false">
        <template #bodyCell="{ column, record, index }: any">
          <template v-if="column.key === 'title'">
            <span>
              {{ record.title }}
            </span>
          </template>
          <template v-if="column.key === 'name'">
            <span>
              {{ record.name }}
            </span>
          </template>
          <template v-else-if="column.key === 'type'">
            <span>{{ record.type }}</span>
          </template>
          <template v-else-if="column.key === 'teamplate'">
            <span>{{ record.teamplate }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a-button type="link" @click="updateColumn(record, index)">编辑</a-button>
              <a-divider type="vertical" />
              <a-button type="link" @click="delColumn(index)">删除</a-button>
            </span>
          </template>
        </template>
      </a-table>
    </div>

    <a-modal v-model:visible="visible" title="创建表字段" @ok="submitForm" @cancel="clearValidate">
      <a-form ref="formRef" name="custom-validation" :model="formState" :rules="rules" v-bind="layout">
        <a-form-item label="类型">
          <a-select v-model:value="formState.type">
            <a-select-option :value="ColumnType.TEXT">{{ ColumnType.TEXT }}</a-select-option>
            <a-select-option :value="ColumnType.NUMBER">{{ ColumnType.NUMBER }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="模板">
          <a-select v-model:value="formState.teamplate">
            <a-select-option :value="ColumnTeamplateType.STRING">{{ ColumnTeamplateType.STRING }}</a-select-option>
            <a-select-option :value="ColumnTeamplateType.NUMBER">{{ ColumnTeamplateType.NUMBER }}</a-select-option>
            <a-select-option :value="ColumnTeamplateType.DATE">{{ ColumnTeamplateType.DATE }}</a-select-option>
            <a-select-option :value="ColumnTeamplateType.STATUS">{{ ColumnTeamplateType.STATUS }}</a-select-option>
            <a-select-option :value="ColumnTeamplateType.FILESIZE">{{ ColumnTeamplateType.FILESIZE }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标题" name="title">
          <a-input v-model:value="formState.title" placeholder="请输入标题" autocomplete="off" />
        </a-form-item>

        <a-form-item label="字段名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入名称" autocomplete="off" />
        </a-form-item>

        <a-form-item v-if="formState.teamplate === ColumnTeamplateType.STATUS" label="状态选项">
          <div style="background-color: #f9f9f9; padding: 12px 24px">
            <div>
              <a-button type="link" style="padding: 4px 0px; color: #1890ffbb" @click="addOption()">新增</a-button>
            </div>
            <div class="option-item flex-row" v-for="(option, index) in formState.options" :key="index">
              <a-input v-model:value="option.key" placeholder="KEY"></a-input>
              <a-input v-model:value="option.value" placeholder="VALUE"></a-input>
              <a-input v-model:value="option.color" placeholder="COLOR"></a-input>
              <div class="del-option_btn" @click="delOption(index)">
                <img src="../../assets/del.png" style="width: 16px; height: 16px" alt="" srcset="" />
              </div>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ColumnType, ColumnTeamplateType } from './index';
import type { ColumnItem } from './index';
import type { TableColumnsType } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';

const visible = ref(false);
const action = ref<'create' | 'update'>('create');
const activeRowIndex = ref(-1);
const columnList = reactive<ColumnItem[]>([]);
let columnListStore = localStorage.getItem('COLUMNLIST');
if (columnListStore) {
  columnList.push(...JSON.parse(columnListStore));
}
const columns = ref<TableColumnsType>([
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Teamplate',
    dataIndex: 'teamplate',
    key: 'teamplate',
  },
  // {
  //   title: 'Options',
  //   key: 'options',
  //   dataIndex: 'options',
  // },
  {
    title: 'Action',
    width: 180,
    key: 'action',
  },
]);

const actionOptions = ['详情', '数据', '编辑', '删除'];

const checkedActionList = ref<string[]>([]);
let checkedActionListStore = localStorage.getItem('CHECKEDACTIONLIST');
if (checkedActionListStore) {
  checkedActionList.value.push(...JSON.parse(checkedActionListStore));
}

function delColumn(index: number) {
  columnList.splice(index, 1);
}

function updateColumn(row: ColumnItem, index: number) {
  action.value = 'update';
  Object.assign(formState, row);
  activeRowIndex.value = index;
  visible.value = true;
}

function addColumn() {
  action.value = 'create';
  visible.value = true;
  Object.assign(formState, {
    teamplate: ColumnTeamplateType.STRING,
    name: '',
    options: [],
    type: ColumnType.TEXT,
  });
}

// 表单逻辑
const formRef = ref<FormInstance>();
const formState = reactive<ColumnItem>({
  title: '',
  name: '',
  teamplate: ColumnTeamplateType.STRING,
  type: ColumnType.TEXT,
  options: [],
});
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入字段名称', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'change' }],
};
const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const submitForm = () => {
  formRef.value
    ?.validateFields()
    .then((validate) => {
      if (validate) {
        if (action.value === 'create') {
          columnList.push({ ...formState });
        }
        if (action.value === 'update') {
          Object.assign(columnList[activeRowIndex.value], formState);
        }
        visible.value = false;
      }
    })
    .catch(() => {});
};

const clearValidate = () => {
  formRef.value?.clearValidate();
};

const addOption = () => {
  console.log(formState);

  formState.options.push({
    key: '',
    value: '',
  });
};

const delOption = (idx: number) => {
  formState.options.splice(idx, 1);
};

defineExpose({
  columnList,
  checkedActionList,
});
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.filter-item {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
}

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
