import i18n from "@/plugins/vue-i18n";

const IntegrationsBitrix24 = () =>
  import(/* webpackChunkName: "integrations-bitrix24" */ "@/views/setting/integrations/bitrix24");

const bitrix24 = [
  {
    path: "settings/integrations/bitrix24",
    name: "Integrations-Bitrix24",
    component: IntegrationsBitrix24,
    meta: {
      title: i18n.t("title.setting.integrations.bitrix24._"),
    },
  },
];

export default bitrix24;
