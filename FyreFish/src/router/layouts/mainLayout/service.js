import i18n from "@/plugins/vue-i18n";

const Service = () => import(/* webpackChunkName: "service" */ "@/views/service");

const service = [
  {
    path: "service",
    name: "Service",
    component: Service,
    meta: {
      title: i18n.t("title.services"),
    },
  },
];

export default service;
