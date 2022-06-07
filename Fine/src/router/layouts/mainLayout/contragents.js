import i18n from "@/plugins/vue-i18n";

const ContragentList = () =>
  import(/* webpackChunkName: "contragent" */ "@/views/contragent/index");
const ContragentsFilter = () =>
  import(/* webpackChunkName: "contragent" */ "@/views/contragent/filter");
const ContragentAdd = () => import(/* webpackChunkName: "contragent" */ "@/views/contragent/add");
const ContragentEdit = () => import(/* webpackChunkName: "contragent" */ "@/views/contragent/edit");

const contragents = [
  {
    path: "contragents",
    name: "ContragentList",
    component: ContragentList,
    meta: {
      title: i18n.t("title.setting.contragent.list"),
    },
  },
  {
    path: "contragents/filter",
    name: "ContragentsFilter",
    component: ContragentsFilter,
    meta: {
      title: i18n.t("title.filter"),
    },
  },
  {
    path: "contragents/0",
    name: "ContragentAdd",
    component: ContragentAdd,
    meta: {
      title: i18n.t("title.setting.contragent.add"),
    },
  },
  {
    path: "contragents/:id",
    name: "ContragentEdit",
    component: ContragentEdit,
    meta: {
      title: i18n.t("title.setting.contragent.edit"),
    },
  },
];

export default contragents;
