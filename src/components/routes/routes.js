import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Admin from "../pages/admin/Admin.vue";
import Dashboard from "../pages/admin/others/Dashboard.vue";
import Users_List from "../pages/admin/others/Users_List.vue";
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
import Info from "../pages/admin/others/Info.vue";
import Edit_User from "../pages/admin/others/Edit_User.vue";
import Operator from "../pages/operator/Operator.vue";
import Check_Out from "../pages/operator/functions/Check_Out.vue";
import Register_OP from "../pages/operator/functions/Register_OP.vue";
import Register_Request from "../pages/operator/functions/Register_Request.vue"
import Machines from "../pages/operator/functions/Machines.vue";
import Observation from "../pages/operator/functions/Observation.vue";
import Order_Observations from "../pages/admin/others/Order_Observations.vue";
import Time_Line from "../pages/admin/others/Time_Line.vue";
import History from "../pages/admin/others/History.vue";
import Edit_Request_Order from "../pages/operator/functions/Edit_Request_Order.vue"

const Foo = { template: "<div>foo</div>" };
//Creo el router
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_MAIN_ROUTE),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      props: true
    },

    {
      path: "/operator",
      name: "operator",
      component: Operator,
      props: true,
      children: [
        {
          path: "/operator/check-out",
          name: "admin.check-out",
          component: Check_Out,
          props: true
        },
        {
          path: "/operator/register-request",
          name: "operator.register-request",
          component: Register_Request,
          props: true
        },
        {
          path: "/operator/register-op",
          name: "operator.register-op",
          component: Register_OP,
          props: true
        },
        {
          path: "/operator/machines",
          name: "operator.machines",
          component: Machines,
          props: true
        },
        {
          path: "/operator/observation",
          name: "operator.observation",
          component: Observation,
          props: true
        },
        {
          path: "/operator/edit-request-order",
          name: "operator.edit-request-order",
          component: Edit_Request_Order,
          props: true
        },
      ],
    },

    {
      path: "/admin",
      name: "admin",
      component: Admin,
      props: true,
      children: [
        {
            path: "/admin/info",
            name: "admin.info",
            component: Info,
            props: true
        },
        {
          path: "/admin/edit-user",
          name: "admin.edit-user",
          component: Edit_User,
          props: true
        },
        {
          path: "/admin/dashboard",
          name: "/admin/dashboard",
          component: Dashboard,
          props: true
        },

        {
          path: "/admin/users-list",
          name: "admin.user-list",
          component: Users_List,
          props: true
        },

        {
          path: "/admin/order-observations",
          name: "admin.order-observations",
          component: Order_Observations,
          props: true
        },

        {
          path: "/admin/time-line",
          name: "admin.time-line",
          component: Time_Line,
          props: true
        },

        {
          path: "/admin/history",
          name: "admin.history",
          component: History,
          props: true
        },

        {
          path: "/admin/graphic-design",
          name: "admin.graphic-design",
          component: Graphic_Design,
          props: true
        },

        {
          path: "/admin/textile-design",
          name: "admin.textile-design",
          component: Textile_Design,
          props: true
        },

        {
          path: "/admin/generate-op",
          name: "admin.generate-op",
          component: Generate_OP,
          props: true
        },

        {
          path: "/admin/print-op",
          name: "admin.print-op",
          component: Print_OP,
          props: true
        },

        {
          path: "/admin/weaving",
          name: "admin.weaving",
          component: Weaving,
          props: true
        },

        {
          path: "/admin/rolled-up",
          name: "admin.rolled-up",
          component: Rolled_Up,
          props: true
        },

        {
          path: "/admin/cuting",
          name: "admin.cuting",
          component: Cuting,
          props: true
        },

        {
          path: "/admin/quality",
          name: "admin.quality",
          component: Quality,
          props: true
        },

        {
          path: "/admin/receipt",
          name: "admin.receipt",
          component: Receipt,
          props: true
        },

        {
          path: "/admin/dispatch",
          name: "admin.dispatch",
          component: Dispatch,
          props: true
        },
      ],
    },
  ],
});

export default router;
