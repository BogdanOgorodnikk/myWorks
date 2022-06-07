import i18n from "@/plugins/vue-i18n";

const UserList = () => import(/* webpackChunkName: "user" */ "@/views/setting/user/index");
const UserAdd = () => import(/* webpackChunkName: "user" */ "@/views/setting/user/add");
const UserEdit = () => import(/* webpackChunkName: "user" */ "@/views/setting/user/edit");

const users = [
  {
    path: "settings/users",
    name: "UserList",
    component: UserList,
    meta: {
      title: i18n.t("title.setting.user.list"),
    },
  },
  {
    path: "settings/users/0",
    name: "UserAdd",
    component: UserAdd,
    meta: {
      title: i18n.t("title.setting.user.add"),
    },
  },
  {
    path: "settings/users/:id",
    name: "UserEdit",
    component: UserEdit,
    meta: {
      title: i18n.t("title.setting.user.edit"),
    },
  },
];

export default users;
