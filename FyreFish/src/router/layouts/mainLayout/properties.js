import i18n from "@/plugins/vue-i18n";

const Properties = () => import(/* webpackChunkName: "properties" */ "@/views/properties");

const properties = [
  {
    path: "properties",
    name: "Properties",
    component: Properties,
    meta: {
      title: i18n.t("title.properties"),
    },
  },
];

export default properties;
