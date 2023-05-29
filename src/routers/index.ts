import { createRouter, createWebHashHistory } from 'vue-router';

import GenCodes from './gen-code/index';

const routes = [...GenCodes];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export { routes };

export default router;
