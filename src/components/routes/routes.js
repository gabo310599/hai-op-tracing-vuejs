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


//Creo el router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          path: "/check-out",
          name: "check-out",
          component: Check_Out,
          props: true
        },
        {
          path: "/register-request",
          name: "register-request",
          component: Register_Request,
          props: true
        },
        {
          path: "/register-op",
          name: "register-op",
          component: Register_OP,
          props: true
        },
        {
          path: "/machines",
          name: "machines",
          component: Machines,
          props: true
        },
        {
          path: "/observation",
          name: "observation",
          component: Observation,
          props: true
        },
        {
          path: "/edit-request-order",
          name: "edit-request-order",
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
            path: "/info",
            name: "info",
            component: Info,
            props: true
        },
        {
          path: "/edit-user",
          name: "edit-user",
          component: Edit_User,
          props: true
        },
        {
          path: "/dashboard",
          name: "dashboard",
          component: Dashboard,
          props: true
        },

        {
          path: "/users-list",
          name: "user-list",
          component: Users_List,
          props: true
        },

        {
          path: "/order-observations",
          name: "order-observations",
          component: Order_Observations,
          props: true
        },

        {
          path: "/time-line",
          name: "time-line",
          component: Time_Line,
          props: true
        },

        {
          path: "/history",
          name: "history",
          component: History,
          props: true
        },

        {
          path: "/graphic-design",
          name: "graphic-design",
          component: Graphic_Design,
          props: true
        },

        {
          path: "/textile-design",
          name: "textile-design",
          component: Textile_Design,
          props: true
        },

        {
          path: "/generate-op",
          name: "generate-op",
          component: Generate_OP,
          props: true
        },

        {
          path: "/print-op",
          name: "print-op",
          component: Print_OP,
          props: true
        },

        {
          path: "/weaving",
          name: "weaving",
          component: Weaving,
          props: true
        },

        {
          path: "/rolled-up",
          name: "rolled-up",
          component: Rolled_Up,
          props: true
        },

        {
          path: "/cuting",
          name: "cuting",
          component: Cuting,
          props: true
        },

        {
          path: "/quality",
          name: "quality",
          component: Quality,
          props: true
        },

        {
          path: "/receipt",
          name: "receipt",
          component: Receipt,
          props: true
        },

        {
          path: "/dispatch",
          name: "dispatch",
          component: Dispatch,
          props: true
        },
      ],
    },

  ],
});

export default router;
