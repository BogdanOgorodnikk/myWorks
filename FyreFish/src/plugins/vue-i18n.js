import i18nPluginDefault from "@ilevel/our.plugin.i18n";
import en from "@/i18n/en.yaml";

export const messages = { en };

class i18nPlugin extends i18nPluginDefault {
  // You can redefine some part of default class here
}

export default new i18nPlugin(messages);
