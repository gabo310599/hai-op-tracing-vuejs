import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Prueba from "../pages/Prueba.vue";
import Admin from "../pages/admin/Admin.vue";
import Dashboard from "../pages/admin/others/Dashboard.vue";
import User from "../pages/admin/others/User.vue";
import Cuting from "../pages/admin/op-processes/Cuting.vue";
import Dispatch from "../pages/admin/op-processes/Dispatch.vue";
import Generate_OP from "../pages/admin/op-processes/Generate_OP.vue";
import Graphic_Design from "../pages/admin/op-processes/Graphic_Design.vue";
import Print_OP from "../pages/admin/op-processes/Print_OP.vue";
import Quality from "../pages/admin/op-processes/Quality.vue";
import Receipt from "../pages/admin/op-processes/Receipt.vue";
import Rolled_Up from "../pages/admin/op-processes/Rolled_Up.vue";
import Textile_Design from "../pages/admin/op-processes/Textile_Design.vue";
import Weaving from "../pages/admin/op-processes/Weaving.vue";
import Contact from "../pages/admin/others/Contact.vue";

const Foo = { template: "<div>foo</div>" };
//Creo el router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },

    {
      path: "/prueba",
      name: "prueba",
      component: Prueba,
    },

    {
      path: "/admin",
      name: "admin",
      component: Admin,
      children: [
        {
            path: "/admin/contact",
            name: "admin.contact",
            component: Contact,
        },
        {
          path: "/admin/dashboard",
          name: "admin.dashboard",
          component: Dashboard,
        },

        {
          path: "/admin/user",
          name: "admin.user",
          component: User,
        },

        {
          path: "/admin/graphic-design",
          name: "admin.graphic-design",
          component: Graphic_Design,
        },

        {
          path: "/admin/textile-design",
          name: "admin.textile-design",
          component: Textile_Design,
        },

        {
          path: "/admin/generate-op",
          name: "admin.generate-op",
          component: Generate_OP,
        },

        {
          path: "/admin/print-op",
          name: "admin.print-op",
          component: Print_OP,
        },

        {
          path: "/admin/weaving",
          name: "admin.weaving",
          component: Weaving,
        },

        {
          path: "/admin/rolled-up",
          name: "admin.rolled-up",
          component: Rolled_Up,
        },

        {
          path: "/admin/cuting",
          name: "admin.cuting",
          component: Cuting,
        },

        {
          path: "/admin/quality",
          name: "admin.quality",
          component: Quality,
        },

        {
          path: "/admin/receipt",
          name: "admin.receipt",
          component: Receipt,
        },

        {
          path: "/admin/dispatch",
          name: "admin.dispatch",
          component: Dispatch,
        },
      ],
    },
  ],
});

export default router;
