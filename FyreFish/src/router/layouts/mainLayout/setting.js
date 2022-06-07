import i18n from "@/plugins/vue-i18n";

const Setting = () => import(/* webpackChunkName: "setting" */ "@/views/setting");

const setting = [
  {
    path: "setting",
    name: "Setting",
    component: Setting,
    meta: {
      title: i18n.t("title.settings"),
    },
  },
];

export default setting;
