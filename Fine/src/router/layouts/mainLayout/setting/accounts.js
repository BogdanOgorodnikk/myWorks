import i18n from "@/plugins/vue-i18n";

const AccountList = () => import(/* webpackChunkName: "account" */ "@/views/setting/account/index");
const AccountAdd = () => import(/* webpackChunkName: "account" */ "@/views/setting/account/add");
const AddAccountCash = () =>
  import(/* webpackChunkName: "account" */ "@/views/setting/account/add/Cash");
const AddAccountCashless = () =>
  import(/* webpackChunkName: "account" */ "@/views/setting/account/add/Cashless");
const AddAccountChooseBank = () =>
  import(/* webpackChunkName: "account" */ "@/views/setting/account/add/ChooseBank");
const AddAccountIntegrationMonoBank = () =>
  import(/* webpackChunkName: "account" */ "@/views/setting/account/add/IntegrationMono");
const AddAccountIntegrationPrivatPersonal = () =>
  import(/* webpackChunkName: "account" */ "@/views/setting/account/add/IntegrationPrivatPersonal");
const AddAccountIntegrationPrivatBusiness = () =>
  import(/* webpackChunkName: "account" */ "@/views/setting/account/add/IntegrationPrivatBusiness");
const AddAccountIntegrationWithOtherBank = () =>
  import(/* webpackChunkName: "account" */ "@/views/setting/account/add/IntegrationWithOtherBank");
const AddAccountIntegratedAccount = () =>
  import(/* webpackChunkName: "account" */ "@/views/setting/account/add/IntegratedAccount");
const AddAccountImportAccountDataFromBank = () =>
  import(/* webpackChunkName: "account" */ "@/views/setting/account/add/ImportAccountDataFromBank");
const AccountEdit = () => import(/* webpackChunkName: "account" */ "@/views/setting/account/edit");

const accounts = [
  {
    path: "settings/accounts",
    name: "AccountList",
    component: AccountList,
    meta: {
      title: i18n.t("title.setting.account.list"),
    },
  },
  {
    path: "settings/accounts/0",
    name: "AccountAdd",
    component: AccountAdd,
    meta: {
      title: i18n.t("title.setting.account.add"),
    },
  },
  {
    path: "settings/accounts/0",
    name: "AddAccountCash",
    component: AddAccountCash,
    meta: {
      title: i18n.t("title.setting.account.add"),
    },
  },
  {
    path: "settings/accounts/0",
    name: "AddAccountCashless",
    component: AddAccountCashless,
    meta: {
      title: i18n.t("title.setting.account.add"),
    },
  },
  {
    path: "settings/accounts/0",
    name: "AddAccountChooseBank",
    component: AddAccountChooseBank,
    meta: {
      title: i18n.t("title.setting.account.add"),
    },
  },
  {
    path: "settings/accounts/0",
    name: "AddAccountIntegrationMonoBank",
    component: AddAccountIntegrationMonoBank,
    meta: {
      title: i18n.t("title.setting.account.add"),
    },
  },
  {
    path: "settings/accounts/0",
    name: "AddAccountIntegrationPrivatPersonal",
    component: AddAccountIntegrationPrivatPersonal,
    meta: {
      title: i18n.t("title.setting.account.add"),
    },
  },
  {
    path: "settings/accounts/0",
    name: "AddAccountIntegrationPrivatBusiness",
    component: AddAccountIntegrationPrivatBusiness,
    meta: {
      title: i18n.t("title.setting.account.add"),
    },
  },
  {
    path: "settings/accounts/0",
    name: "AddAccountIntegrationWithOtherBank",
    component: AddAccountIntegrationWithOtherBank,
    meta: {
      title: i18n.t("title.setting.account.add"),
    },
  },
  {
    path: "settings/accounts/0",
    name: "AddAccountIntegratedAccount",
    component: AddAccountIntegratedAccount,
    meta: {
      title: i18n.t("title.setting.account.add"),
    },
  },
  {
    path: "settings/accounts/0",
    name: "AddAccountImportAccountDataFromBank",
    component: AddAccountImportAccountDataFromBank,
    meta: {
      title: i18n.t("title.setting.account.add"),
    },
  },
  {
    path: "settings/accounts/:id",
    name: "AccountEdit",
    component: AccountEdit,
    meta: {
      title: i18n.t("title.setting.account.edit"),
    },
  },
];

export default accounts;
