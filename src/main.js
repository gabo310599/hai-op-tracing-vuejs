import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'datatables'
import router from './components/routes/routes.js'
import 'admin-lte/plugins/jquery/jquery.min.js';
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js';
import 'admin-lte/dist/js/adminlte.min.js';
import 'connect-history-api-fallback'

import './assets/main.css'
// const history = require('connect-history-api-fallback');

const app = createApp(App)

// app.use(history());
app.use(router)

app.mount('#app')

export const mainRoute = import.meta.env.VITE_MAIN_ROUTE;