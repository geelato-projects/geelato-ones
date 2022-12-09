import {createApp} from "vue";
import {createPinia} from 'pinia'
import antd from 'ant-design-vue'
import App from "./App.vue";
import 'ant-design-vue/dist/antd.css';
import router from "./router/router";
import "./style.css";


const pinia = createPinia()
const app = createApp(App)
import {invoke} from "@tauri-apps/api/tauri";

app.use(router)
app.use(antd)
app.use(pinia)
app.mount("#app");

// const x = await invoke("greet", {name: ''});
console.log('window.__TAURI_IPC__:', window.__TAURI_IPC__)
