import type { RouteRecordRaw } from 'vue-router';

const GenCode = () => import('../../pages/gen-code/index.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/gen-code',
    name: '代码生成器',
    component: GenCode,
    meta: {},
  },
];

export default routes;
