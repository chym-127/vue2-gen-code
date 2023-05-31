import { message } from 'ant-design-vue';

interface Field {
  id: string;
  name: string;
  fieldName: string;
  rendererId: number;
  type: number;
  expand: string;
  htmlField: string;
}

function genCode(teamplate: any, fields: Field[], rendererMapper: any) {
  let dataArr: any[] = [];
  let methodsArr: any[] = [];
  let cssArr: any[] = [];
  let htmls: { [key: string]: any } = {};

  teamplate.options.forEach((option: any) => {
    let field_name = `_${option.value}_fields`;
    htmls[option.value] = [];
    htmls[field_name] = [];
  });

  let rendererCountMap: { [key: string]: any } = {};
  for (let index = 0; index < fields.length; index++) {
    const field = fields[index];
    if (rendererCountMap[field.rendererId]) {
      rendererCountMap[field.rendererId] += 1;
    } else {
      rendererCountMap[field.rendererId] = 1;
    }
    let expand = field.expand ? JSON.parse(field.expand) : {};
    let renderField = {
      name: field.name,
      fieldName: field.fieldName,
      ...expand,
      count: rendererCountMap[field.rendererId],
    };

    let htmlStr = ejs.render(rendererMapper[field.rendererId].renders['html'], {
      item: renderField,
    });

    if (htmls[field.htmlField]) {
      htmls[field.htmlField].push(htmlStr);
      let field_name = `_${field.htmlField}_fields`;
      htmls[field_name].push(field);
    }

    let dataStr = ejs.render(rendererMapper[field.rendererId].renders['data'], {
      item: renderField,
    });

    let methodsStr = ejs.render(rendererMapper[field.rendererId].renders['methods'], {
      item: renderField,
    });

    let cssStr = ejs.render(rendererMapper[field.rendererId].renders['css'], {
      item: renderField,
    });

    if (dataStr) {
      dataArr.push(dataStr + ',');
    }

    if (methodsStr) {
      methodsArr.push(methodsStr + ',');
    }
    if (cssStr) {
      cssArr.push(cssStr);
    }
  }
  let html = '';
  try {
    html = ejs.render(teamplate.content, {
      dataArr: dataArr,
      methodsArr: methodsArr,
      cssArr: cssArr,
      htmls: htmls,
    });
  } catch (error) {
    console.log(error);
    message.error('操作失败');
  }
  return html;
}

export { genCode };
