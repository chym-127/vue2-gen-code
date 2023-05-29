<script setup lang="ts">
import { computed, ref } from 'vue';
import FilterBarConfig from '../../components/FilterBarConfig/index.vue';
import TableConfig from '../../components/TableConfig/index.vue';
import teamplateStr from './teamplate';
import {
  DaterangeFilterRender,
  InstanceProps as FilterBarConfigProps,
  FilterItemType,
  SelectFilterRender,
  TextFilterRender,
} from '../../components/FilterBarConfig';
import { message } from 'ant-design-vue';
import {
  InstanceProps as TableConfigProps,
  ColumnType,
  ActionDetailsRender,
  ActionDataRender,
  ActionUpdateRender,
  ActionDeleteRender,
  ColumnTeamplateType,
  ColumnNumberRender,
  ColumnStringRender,
  ColumnDateRender,
  ColumnStatusRender,
  ColumnFileSizeRender,
  ActionType,
} from '../../components/TableConfig';

const filterBarConfigRef = ref<FilterBarConfigProps>();
const tableConfigRef = ref<TableConfigProps>();

function genCode() {
  const dataArr: string[] = [];
  const methodsArr: string[] = [];
  const filterHtmlArr: string[] = [];
  const tableHtmlArr: string[] = [];
  const actionHtmlArr: string[] = [];

  const cssArr: string[] = [];

  let filters = filterBarConfigRef?.value?.filters;
  if (filters) {
    let textCount = 0;
    let selectCount = 0;
    let dateCount = 0;
    let filerFormData = `
        filterForm: {
    `;
    filters.forEach((filter, index) => {
      let str = '';
      filerFormData += `${filter.fieldName}: '',`;

      switch (filter.type) {
        case FilterItemType.TEXT:
          str = TextFilterRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = TextFilterRender.methods();
          if (str) {
            methodsArr.push(str);
          }
          str = TextFilterRender.html(filter.fieldName, filter.placeholder);
          if (str) {
            filterHtmlArr.push(str);
          }
          textCount += 1;
          break;
        case FilterItemType.SELECT:
          str = SelectFilterRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = SelectFilterRender.methods();
          if (str) {
            methodsArr.push(str);
          }
          str = SelectFilterRender.html(filter.title, filter.fieldName, filter.placeholder, filter.options);
          if (str) {
            filterHtmlArr.push(str);
          }
          selectCount += 1;
          break;
        case FilterItemType.DATERANGE:
          str = DaterangeFilterRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = DaterangeFilterRender.methods(filter.fieldName, filter.anotherFieldName, dateCount);
          if (str) {
            methodsArr.push(str);
          }
          str = DaterangeFilterRender.html(filter.title, dateCount);
          if (str) {
            filterHtmlArr.push(str);
          }
          dateCount += 1;
          break;
        default:
          break;
      }
    });
    filerFormData += '},';
    dataArr.push(filerFormData);
  }

  let columnList = tableConfigRef?.value?.columnList;
  let checkedActionList = tableConfigRef?.value?.checkedActionList;

  if (columnList) {
    let textCount = 0;
    let statusCount = 0;
    let filesizeCount = 0;
    let numberCount = 0;
    let dateCount = 0;
    let columnsData = `
        columns: [
    `;

    columnList.forEach((column, index) => {
      let str = '';
      columnsData += `
        {
            title: '${column.title}',
            dataIndex: '${column.name}',
            key: '${column.name}',
            width: 300,
            scopedSlots: { customRender: '${column.name}' },
        },
      `;
      switch (column.teamplate) {
        case ColumnTeamplateType.STRING:
          str = ColumnStringRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = ColumnStringRender.css();
          if (str) {
            cssArr.push(str);
          }
          str = ColumnStringRender.html(column.name);
          if (str) {
            tableHtmlArr.push(str);
          }
          textCount += 1;
          break;
        case ColumnTeamplateType.NUMBER:
          str = ColumnNumberRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = ColumnNumberRender.css();
          if (str) {
            cssArr.push(str);
          }
          str = ColumnNumberRender.html(column.name);
          if (str) {
            tableHtmlArr.push(str);
          }
          numberCount += 1;
          break;
        case ColumnTeamplateType.DATE:
          str = ColumnDateRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = ColumnDateRender.css();
          if (str) {
            cssArr.push(str);
          }
          str = ColumnDateRender.html(column.name);
          if (str) {
            tableHtmlArr.push(str);
          }
          dateCount += 1;
          break;
        case ColumnTeamplateType.FILESIZE:
          str = ColumnFileSizeRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = ColumnFileSizeRender.css();
          if (str) {
            cssArr.push(str);
          }
          str = ColumnFileSizeRender.html(column.name);
          if (str) {
            tableHtmlArr.push(str);
          }
          filesizeCount += 1;
          break;
        case ColumnTeamplateType.STATUS:
          str = ColumnStatusRender.data(column.options, statusCount);
          if (str) {
            dataArr.push(str);
          }
          str = ColumnStatusRender.css();
          if (str) {
            cssArr.push(str);
          }
          str = ColumnStatusRender.html(column.name, statusCount);
          if (str) {
            tableHtmlArr.push(str);
          }
          statusCount += 1;
          break;
      }
    });
    if (checkedActionList?.length) {
      columnsData += `
      {
          title: '操作',
          dataIndex: 'action',
          slot: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
      }
      `;
    }
    columnsData += '],';
    dataArr.push(columnsData);
  }

  if (checkedActionList && checkedActionList.length) {
    let str = '';
    checkedActionList.forEach((action, index) => {
      switch (action) {
        case ActionType.DATA:
          str = ActionDataRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = ActionDataRender.methods();
          if (str) {
            methodsArr.push(str);
          }
          str = ActionDataRender.html();
          if (str) {
            actionHtmlArr.push(str);
          }
          break;
        case ActionType.DELETE:
          str = ActionDeleteRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = ActionDeleteRender.methods();
          if (str) {
            methodsArr.push(str);
          }
          str = ActionDeleteRender.html();
          if (str) {
            actionHtmlArr.push(str);
          }
          break;
        case ActionType.DETAILS:
          str = ActionDetailsRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = ActionDetailsRender.methods();
          if (str) {
            methodsArr.push(str);
          }
          str = ActionDetailsRender.html();
          if (str) {
            actionHtmlArr.push(str);
          }
          break;
        case ActionType.UPDATE:
          str = ActionUpdateRender.data();
          if (str) {
            dataArr.push(str);
          }
          str = ActionUpdateRender.methods();
          if (str) {
            methodsArr.push(str);
          }
          str = ActionUpdateRender.html();
          if (str) {
            actionHtmlArr.push(str);
          }
          break;
        default:
          break;
      }
      if (index != checkedActionList!.length - 1) {
        actionHtmlArr.push('<a-divider type="vertical" />');
      }
    });
  }

  let html = ejs.render(teamplateStr, {
    dataArr: dataArr,
    methodsArr: methodsArr,
    tableHtmlArr: tableHtmlArr,
    filterHtmlArr: filterHtmlArr,
    actionHtmlArr: actionHtmlArr,
    cssArr: cssArr,
  });
  code.value = html;
  visible.value = true;

  localStorage.setItem('FILTERS', JSON.stringify(filters));
  localStorage.setItem('COLUMNLIST', JSON.stringify(columnList));
  localStorage.setItem('CHECKEDACTIONLIST', JSON.stringify(checkedActionList));
}

const visible = ref(false);
const code = ref('');

function clipboard() {
  navigator.clipboard.writeText(code.value);
  message.success('复制成功');
}
</script>

<template>
  <div class="container">
    <FilterBarConfig ref="filterBarConfigRef"></FilterBarConfig>
    <div class="space"></div>
    <TableConfig ref="tableConfigRef"></TableConfig>
    <a-modal v-model:visible="visible" title="代码" :width="800" okText="复制" @ok="clipboard">
      <div>
        <a-textarea id="code-textarea" v-model:value="code" :rows="20" />
      </div>
    </a-modal>
    <div style="display: flex; justify-content: flex-end">
      <a-button type="primary" @click="genCode()" style="margin-top: 16px">生成</a-button>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 24px;
}
.space {
  width: 100%;
  height: 32px;
}
</style>
