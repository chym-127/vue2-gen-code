enum FilterItemType {
  TEXT,
  SELECT,
  DATERANGE,
}

interface InstanceProps {
  filters: FilterItem[];
}

interface FilterItemOption {
  key: Number | string;
  value: string;
}

interface FilterItem {
  title: string;
  fieldName: string;
  anotherFieldName: string;
  options: FilterItemOption[];
  placeholder: string;
  type: FilterItemType;
}

const filterItemFieldNameMapper: { [key: number]: string } = {
  0: 'TEXT',
  1: 'SELECT',
  2: 'DATERANGE',
};

const TextFilterRender = {
  data() {
    return ``;
  },
  html(fieldName: string, placeholder: string) {
    return `
          <a-input-search
              v-model="filterForm.${fieldName}"
              placeholder="${placeholder}"
              allowClear
              style="width: 220px"
              @change="
                  $delay(() => {
                      getData();
                  }, 500)
              "
          />
          `;
  },
  methods() {
    return ``;
  },
};

const SelectFilterRender = {
  data() {
    return ``;
  },
  html(title: string, fieldName: string, placeholder: string, options: FilterItemOption[]) {
    let optionHtml = () => {
      let str = ``;
      options.forEach((option) => {
        str += `<a-select-option :value="${option.key}">${option.value}</a-select-option>\n`;
      });
      return str;
    };
    return `
          <div class="filter-item_label">${title}:</div>
          <a-select
              :getPopupContainer="$getPopupContainer()"
              v-model="filterForm.${fieldName}"
              placeholder="${placeholder}"
              style="width: 160px"
              allowClear
              @change="
                  $delay(() => {
                      getData();
                  }, 500)
              "
          >
              ${optionHtml()}
          </a-select>
          `;
  },
  methods() {
    return ``;
  },
};

const DaterangeFilterRender = {
  data() {
    return ``;
  },
  html(title: string, index: number) {
    return `
          <div class="filter-item_label">${title}:</div>
          <a-range-picker @change="onDateChange${index > 0 ? index : ''}" style="width: 220px;">
              <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
          `;
  },
  methods(startDateFieldName: string, endDateFieldName: string, index: number) {
    return `
          onDateChange${index > 0 ? index : ''}(val) {
              if (val.length > 0) {
                this.filterForm.${startDateFieldName} = moment(val[0]).startOf('day').valueOf();
                this.filterForm.${endDateFieldName} = moment(val[1]).endOf('day').valueOf();
              } else {
                this.filterForm.${startDateFieldName} = '';
                this.filterForm.${endDateFieldName} = '';
              }
              this.getData();
          },
          `;
  },
};

export { FilterItemType, filterItemFieldNameMapper, TextFilterRender, SelectFilterRender, DaterangeFilterRender };
export type { FilterItem, FilterItemOption, InstanceProps };
