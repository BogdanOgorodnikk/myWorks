import i18n from "@/plugins/vue-i18n";

const RoleList = () => import(/* webpackChunkName: "role" */ "@/views/setting/role/index");
const RoleAdd = () => import(/* webpackChunkName: "role" */ "@/views/setting/role/add");
const RoleEdit = () => import(/* webpackChunkName: "role" */ "@/views/setting/role/edit");

const roles = [
  {
    path: "settings/roles",
    name: "RoleList",
    component: RoleList,
    meta: {
      title: i18n.t("title.setting.role.list"),
    },
  },
  {
    path: "settings/roles/0",
    name: "RoleAdd",
    component: RoleAdd,
    meta: {
      title: i18n.t("title.setting.role.add"),
    },
  },
  {
    path: "settings/roles/:id",
    name: "RoleEdit",
    component: RoleEdit,
    meta: {
      title: i18n.t("title.setting.role.edit"),
    },
  },
];

export default roles;
