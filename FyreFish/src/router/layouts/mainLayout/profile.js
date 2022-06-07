import i18n from "@/plugins/vue-i18n";

const Profile = () => import(/* webpackChunkName: "profile" */ "@/views/profile");

const profile = [
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: i18n.t("title.profile"),
    },
  },
];

export default profile;
