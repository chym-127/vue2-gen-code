<template>
  <div>
    <div class="header">
      <h3>配置筛选字段</h3>
      <a-button type="primary" @click="addFilterItem()">新增</a-button>
    </div>
    <div>
      <a-table :columns="columns" :data-source="filters" :pagination="false">
        <template #bodyCell="{ column, record, index }: any">
          <template v-if="column.key === 'title'">
            <span>
              {{ record.title }}
            </span>
          </template>
          <template v-else-if="column.key === 'type'">
            <span>{{ filterItemFieldNameMapper[record.type] }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a-button type="link" @click="updateFilterItem(record, index)">编辑</a-button>
              <a-divider type="vertical" />
              <a-button type="link" @click="delFilterItem(index)">删除</a-button>
            </span>
          </template>
        </template>
      </a-table>
    </div>

    <a-modal v-model:visible="visible" title="创建过滤字段" @ok="submitForm" @cancel="clearValidate">
      <a-form ref="formRef" name="custom-validation" :model="formState" :rules="rules" v-bind="layout">
        <a-form-item label="类型">
          <a-select ref="select" v-model:value="formState.type">
            <a-select-option :value="0">TEXT</a-select-option>
            <a-select-option :value="1">SELECT</a-select-option>
            <a-select-option :value="2">DATERANGE</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标题" name="title">
          <a-input v-model:value="formState.title" placeholder="请输入标题" autocomplete="off" />
        </a-form-item>
        <a-form-item
          :label="formState.type === FilterItemType.DATERANGE ? '开始时间字段名' : '字段名称'"
          name="fieldName"
        >
          <div class="flex-row justify-space-between">
            <a-input
              v-model:value="formState.fieldName"
              :placeholder="formState.type === FilterItemType.DATERANGE ? '请输入开始时间字段名' : '请输入字段名'"
              autocomplete="off"
            />
          </div>
        </a-form-item>

        <a-form-item v-if="formState.type === FilterItemType.SELECT" label="选项">
          <div style="background-color: #f9f9f9; padding: 12px 24px">
            <div>
              <a-button type="link" style="padding: 4px 0px; color: #1890ffbb" @click="addOption">新增</a-button>
            </div>
            <div class="option-item flex-row" v-for="(option, index) in formState.options" :key="index">
              <a-input v-model:value="option.key" placeholder="KEY"></a-input>
              <a-input v-model:value="option.value" placeholder="VALUE"></a-input>
              <div class="del-option_btn" @click="delOption(index)">
                <img src="../../assets/del.png" style="width: 16px; height: 16px" alt="" srcset="" />
              </div>
            </div>
          </div>
        </a-form-item>

        <a-form-item v-if="formState.type === FilterItemType.DATERANGE" label="结束时间字段名" name="fieldName">
          <a-input placeholder="请输入结束时间字段名" v-model:value="formState.anotherFieldName" autocomplete="off" />
        </a-form-item>

        <a-form-item label="输入占位符" name="placeholder">
          <a-input v-model:value="formState.placeholder" placeholder="请输入占位符" autocomplete="off" />
        </a-form-item>

        <!-- <a-form-item :wrapper-col="{ span: 14, offset: 5 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { FilterItemType, filterItemFieldNameMapper } from './index';
import type { FilterItem, FilterItemOption } from './index';
import type { TableColumnsType } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';

const visible = ref(false);
const action = ref<'create' | 'update'>('create');
const activeRowIndex = ref(-1);
const filters = reactive<FilterItem[]>([]);
let filterStore = localStorage.getItem('FILTERS');
if (filterStore) {
  filters.push(...JSON.parse(filterStore));
}
const columns = ref<TableColumnsType>([
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'FieldName',
    dataIndex: 'fieldName',
    key: 'fieldName',
  },
  {
    title: 'Placeholder',
    key: 'placeholder',
    dataIndex: 'placeholder',
  },
  {
    title: 'Action',
    width: 180,
    key: 'action',
  },
]);

function delFilterItem(index: number) {
  filters.splice(index, 1);
}

function updateFilterItem(row: FilterItem, index: number) {
  action.value = 'update';
  Object.assign(formState, row);
  activeRowIndex.value = index;
  visible.value = true;
}

function addFilterItem() {
  action.value = 'create';
  visible.value = true;
  Object.assign(formState, {
    title: '',
    fieldName: '',
    options: [
      {
        key: '',
        value: '',
      },
    ],
    anotherFieldName: '',
    type: FilterItemType.TEXT,
    placeholder: '',
  });
}

// 表单逻辑
const formRef = ref<FormInstance>();
const formState = reactive<FilterItem>({
  title: '',
  fieldName: '',
  options: [
    {
      key: '',
      value: '',
    },
  ],
  anotherFieldName: '',
  type: FilterItemType.SELECT,
  placeholder: '',
});
const rules: Record<string, Rule[]> = {
  title: [{ required: true, message: '', trigger: 'change' }],
  fieldName: [{ required: true, message: '', trigger: 'change' }],
  placeholder: [{ required: true, message: '', trigger: 'change' }],
};
const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const submitForm = () => {
  let validate = formRef.value?.validateFields();
  if (validate) {
    if (action.value === 'create') {
      filters.push({ ...formState });
    }
    if (action.value === 'update') {
      Object.assign(filters[activeRowIndex.value], formState);
    }
    visible.value = false;
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

defineExpose({
  filters,
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
