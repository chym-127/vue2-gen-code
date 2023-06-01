import { createApp } from "vue";
import "./styles.css";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from "./App.vue";
import routers from './routers'
import installComponent from './components/index'

const app = createApp(App);
installComponent(app);
app.use(routers);
app.use(Antd)
app.mount("#app");
