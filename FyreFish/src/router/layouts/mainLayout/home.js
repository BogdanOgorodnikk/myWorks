import i18n from "@/plugins/vue-i18n";

const Home = () => import(/* webpackChunkName: "home" */ "@/views/home");

const home = [
  {
    path: "home",
    name: "Home",
    component: Home,
    meta: {
      title: i18n.t("title.home"),
    },
  },
];

export default home;
