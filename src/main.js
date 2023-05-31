import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'datatables'
import router from './components/routes/routes.js'
import 'admin-lte/plugins/jquery/jquery.min.js';
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js';
import 'admin-lte/dist/js/adminlte.min.js';

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.mount('#app')

export const mainRoute = "http://localhost:3000/";