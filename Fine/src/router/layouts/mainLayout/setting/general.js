import i18n from "@/plugins/vue-i18n";

const General = () => import(/* webpackChunkName: "general" */ "@/views/setting/general");

let category = [
  {
    path: "settings/main",
    name: "General",
    component: General,
    meta: {
      title: i18n.t("title.setting.common._"),
    },
  },
];

export default category;
