import i18n from "@/plugins/vue-i18n";

const Support = () => import(/* webpackChunkName: "setting" */ "@/views/support");

const support = [
  {
    path: "support",
    name: "Support",
    component: Support,
    meta: {
      title: i18n.t("title.support"),
    },
  },
];

export default support;
