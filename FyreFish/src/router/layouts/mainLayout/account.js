import i18n from "@/plugins/vue-i18n";

const Account = () => import(/* webpackChunkName: "account" */ "@/views/account/index");

const account = [
  {
    path: "account",
    name: "Account",
    component: Account,
    meta: {
      title: i18n.t("title.account"),
    },
  },
];

export default account;
