import categories from "@/router/layouts/mainLayout/setting/categories";
import companies from "@/router/layouts/mainLayout/setting/companies";
import accounts from "@/router/layouts/mainLayout/setting/accounts";
import general from "@/router/layouts/mainLayout/setting/general";
import tags from "@/router/layouts/mainLayout/setting/tags";
import projects from "@/router/layouts/mainLayout/setting/projects";
import integrationsBitrix24 from "@/router/layouts/mainLayout/setting/integrations-bitrix24";
import roles from "@/router/layouts/mainLayout/setting/roles";
import users from "@/router/layouts/mainLayout/setting/users";

import i18n from "@/plugins/vue-i18n";
const List = () => import(/* webpackChunkName: "settings" */ "@/views/setting/index");

const settings = [
  {
    path: "settings",
    name: "SettingsList",
    component: List,
    meta: {
      title: i18n.t("title.setting._"),
    },
  },
  ...categories,
  ...companies,
  ...accounts,
  ...general,
  ...tags,
  ...projects,
  ...integrationsBitrix24,
  ...roles,
  ...users,
];

export default settings;
