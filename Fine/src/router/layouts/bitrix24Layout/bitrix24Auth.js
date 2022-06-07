import i18n from "@/plugins/vue-i18n";

const Bitrix24SignUp = () =>
  import(/* webpackChunkName: "bitrix24Auth" */ "@/views/bitrix24/signUp");
const Bitrix24Connect = () =>
  import(/* webpackChunkName: "bitrix24Auth" */ "@/views/bitrix24/connect");

const bitrix24Auth = [
  {
    path: "/bitrix24-signUp",
    name: "Bitrix24SignUp",
    component: Bitrix24SignUp,
    meta: {
      title: i18n.t("title.signUp"),
    },
  },
  {
    path: "/bitrix24-connect",
    name: "Bitrix24Connect",
    component: Bitrix24Connect,
    meta: {
      title: i18n.t("title.connect"),
    },
  },
];

export default bitrix24Auth;
