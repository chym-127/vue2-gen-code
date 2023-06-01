import JsonFormat from './JsonFormat/index.vue';

const installComponent = (app: any) => {
  app.component('JsonFormat', JsonFormat);
};

export default installComponent;
