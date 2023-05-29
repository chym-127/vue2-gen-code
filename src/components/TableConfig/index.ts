enum ColumnType {
  TEXT = '文本',
  NUMBER = '数字',
}

enum ColumnTeamplateType {
  NUMBER = '数值',
  STRING = '字符串',
  DATE = '日期',
  STATUS = '状态',
  FILESIZE = '文件大小',
}

enum ActionType {
  DETAILS = '详情',
  DATA = '数据',
  UPDATE = '编辑',
  DELETE = '删除',
}

const ActionDetailsRender = {
  data() {
    return ``;
  },
  methods() {
    return `
    openDetail(row) {
      this.$router.push({
        path: '',//TODO 详情页面路径
        query: {
          id: row.id //TODO 传参
        }
      });
    },
    `;
  },
  html() {
    return `
    <span class="action-btn" @click="openDetail(row)">详情</span>
    `;
  },
};

const ActionDataRender = {
  data() {
    return ``;
  },
  methods() {
    return `
    openData(row) {
      this.$router.push({
        path: '',//TODO 数据页面路径
        query: {
          id: row.id //TODO 传参
        }
      });
    },
    `;
  },
  html() {
    return `
    <span class="action-btn" @click="openData(row)">数据</span>
    `;
  },
};

const ActionUpdateRender = {
  data() {
    return ``;
  },
  methods() {
    return `
    openUpdate(row) {
      if (row) {
        this.$router.push({
          path: '',//TODO 更新页面
          query: {
            id: row.id
          }
        });
      } else {
        this.$router.push({
          path: '/adManagement/create'//TODO 创建页面
        });
      }
    },
    `;
  },
  html() {
    return `
    <span class="action-btn" @click="openUpdate(row)">编辑</span>
    `;
  },
};

const ActionDeleteRender = {
  data() {
    return ``;
  },
  methods() {
    return `
    handleDelete(row) {
      // eslint-disable-next-line consistent-this
      let self = this;
      this.$confirm({
        title: '删除后不可恢复，确定要删除该条记录吗？',
        okText: '确定',
        okType: '',
        cancelText: '取消',
        type: 'warning',
        centered: true,
        iconType: 'exclamation-circle',
        onOk: async () => {
          try {
            delApi({ id: row.id }).then((resp) => {//调用删除api
              if (resp.code === 0) {
                self.$message.success('删除成功');
                self.getData();
              } else {
                self.$message.error('删除失败');
              }
            });
          } catch (error) {
            self.$message.error('删除失败');
          }
        }
      });
    },
    `;
  },
  html() {
    return `
    <span class="action-btn" @click="handleDelete(row)">删除</span>
    `;
  },
};

interface InstanceProps {
  columnList: ColumnItem[];
  checkedActionList: string[];
}

interface StatusOption {
  key: Number | string;
  value: string;
  color?: '';
}

interface ColumnItem {
  title: string;
  teamplate: ColumnTeamplateType;
  name: string;
  options: StatusOption[];
  type: ColumnType;
}

const ColumnNumberRender = {
  data() {
    return ``;
  },
  css() {
    return ``;
  },
  html(name: string) {
    return `
    <div slot="${name}" slot-scope="row">{{ row.${name} ? row.${name} : 0 }}</div>
    `;
  },
};

const ColumnStringRender = {
  data() {
    return ``;
  },
  css() {
    return ``;
  },
  html(name: string) {
    return `
    <div slot="${name}" slot-scope="row">{{ row.${name} ? row.${name} : '-' }}</div>
    `;
  },
};

const ColumnDateRender = {
  data() {
    return ``;
  },
  css() {
    return ``;
  },
  html(name: string) {
    return `
    <div slot="${name}" slot-scope="row">{{ row.${name} ? $fmtMoment(row.${name}) : '-' }}</div>
    `;
  },
};

const ColumnStatusRender = {
  data(options: StatusOption[], index: number) {
    let stateStr = () => {
      let str = ``;
      options.forEach((option) => {
        str += `${option.key}: {
          text: '${option.value}',
          color: '${option.color}'
        },`;
      });
      return str;
    };
    return `
    stateMapper${index > 0 ? index : ''}: {
      ${stateStr()}
    },
    `;
  },
  html(name: string, index: number) {
    return `
    <div slot="${name}" slot-scope="row">
      <div class="status-item row-">
          <div class="point" :style="{background:stateMapper${index > 0 ? index : ''}[row.${name}].color}"></div>
          <span>{{ row.status ? stateMapper${index > 0 ? index : ''}[row.${name}].text : '-' }}</span>
      </div>
    </div>
    `;
  },
  css() {
    return `
    .status-item {
      align-items: center;
      .point {
        margin-right: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
    }
    `;
  },
};

const ColumnFileSizeRender = {
  data() {
    return ``;
  },
  css() {
    return ``;
  },
  html(name: string) {
    return `
    <div slot="${name}" slot-scope="row">{{ row.${name} ? $formatSize(row.${name}) : '-' }}</div>
    `;
  },
};

export {
  ColumnType,
  ActionType,
  ColumnTeamplateType,
  ColumnNumberRender,
  ColumnStringRender,
  ColumnDateRender,
  ColumnStatusRender,
  ColumnFileSizeRender,
  ActionDetailsRender,
  ActionDataRender,
  ActionUpdateRender,
  ActionDeleteRender,
};
export type { ColumnItem, InstanceProps };
