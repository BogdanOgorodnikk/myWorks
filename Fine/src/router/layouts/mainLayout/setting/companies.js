import i18n from "@/plugins/vue-i18n";

const CompanyList = () => import(/* webpackChunkName: "company" */ "@/views/setting/company/index");
const CompanyAdd = () => import(/* webpackChunkName: "company" */ "@/views/setting/company/add");
const CompanyEdit = () => import(/* webpackChunkName: "company" */ "@/views/setting/company/edit");

const companies = [
  {
    path: "settings/companies",
    name: "CompanyList",
    component: CompanyList,
    meta: {
      title: i18n.t("title.setting.company.list"),
    },
  },
  {
    path: "settings/companies/0",
    name: "CompanyAdd",
    component: CompanyAdd,
    meta: {
      title: i18n.t("title.setting.company.add"),
    },
  },
  {
    path: "settings/companies/:id",
    name: "CompanyEdit",
    component: CompanyEdit,
    meta: {
      title: i18n.t("title.setting.company.edit"),
    },
  },
];

export default companies;
