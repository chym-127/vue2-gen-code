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
  console.log(teamplate);
  console.log(fields);
  console.log(rendererMapper);

  let dataArr: any[] = [];
  let methodsArr: any[] = [];
  let cssArr: any[] = [];
  let htmls: { [key: string]: any } = {};
  teamplate.options.forEach((option: any) => {
    let field_name = `_${option.value}_fields`
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
    console.log(renderField, 'renderField');
    console.log(rendererMapper[field.rendererId].renders['html']);

    let htmlStr = ejs.render(rendererMapper[field.rendererId].renders['html'], {
      item: renderField,
    });
    console.log('htmlStr=====', htmlStr);

    if (htmls[field.htmlField]) {
      htmls[field.htmlField].push(htmlStr);
      let field_name = `_${field.htmlField}_fields`
      htmls[field_name].push(field);
    }


    let dataStr = ejs.render(rendererMapper[field.rendererId].renders['data'], {
      item: renderField,
    });
    console.log('dataStr=====', dataStr);

    let methodsStr = ejs.render(rendererMapper[field.rendererId].renders['methods'], {
      item: renderField,
    });

    console.log('methodsStr=====', methodsStr);

    let cssStr = ejs.render(rendererMapper[field.rendererId].renders['css'], {
      item: renderField,
    });

    if (dataStr) {
      dataArr.push(dataStr + ',');
    }
    if (methodsArr) {
      methodsArr.push(methodsStr + ',');
    }
    if (cssStr) {
      cssArr.push(cssStr);
    }
  }
  console.log(htmls);

  let html = ejs.render(teamplate.content, {
    dataArr: dataArr,
    methodsArr: methodsArr,
    cssArr: cssArr,
    htmls: htmls,
  });

  console.log(html);
}

export { genCode };
