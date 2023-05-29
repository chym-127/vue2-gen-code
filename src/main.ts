import { createApp } from "vue";
import "./styles.css";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from "./App.vue";
import routers from './routers'

const app = createApp(App);
app.use(routers);
app.use(Antd)
app.mount("#app");
