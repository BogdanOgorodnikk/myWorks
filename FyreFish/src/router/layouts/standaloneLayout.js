import i18n from "@/plugins/vue-i18n";
const Invoice = () => import(/* webpackChunkName: "billing" */ "@/views/billing/invoice");

const billing = [
  {
    path: "billing/invoice",
    name: "Invoice",
    component: Invoice,
    meta: {
      title: i18n.t("title.invoice"),
    },
  },
];

const StandaloneLayout = () => import(/* webpackChunkName: "standalone" */ "@/layouts/standalone");

const standaloneLayout = [
  {
    path: "/",
    name: "StandaloneLayout",
    component: StandaloneLayout,
    children: [...billing],
  },
];

export default standaloneLayout;
