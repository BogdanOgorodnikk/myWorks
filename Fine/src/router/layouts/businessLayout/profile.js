import i18n from "@/plugins/vue-i18n";

const Profile = () => import(/* webpackChunkName: "profile" */ "@/views/profile/edit");
const ChangePassword = () =>
  import(/* webpackChunkName: "profile" */ "@/views/profile/edit/ChangePassword");

const profile = [
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: i18n.t("title.profile"),
    },
  },
  {
    path: "/profile/password",
    name: "ChangePassword",
    component: ChangePassword,
    meta: {
      title: i18n.t("title.changingPassword"),
    },
  },
];

export default profile;
