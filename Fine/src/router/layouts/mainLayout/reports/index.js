import i18n from "@/plugins/vue-i18n";
const List = () => import(/* webpackChunkName: "report" */ "@/views/reports/index");

const reports = [
  {
    path: "reports",
    name: "ReportsList",
    component: List,
    meta: {
      title: i18n.t("title.report._"),
    },
  },
];

export default reports;
