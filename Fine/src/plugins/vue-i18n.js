import I18nPluginDefault from "@ilevel/our.plugin.i18n";
import en from "@/i18n/en.yaml";
import ru from "@/i18n/ru.yaml";
import ua from "@/i18n/ua.yaml";

export const messages = { en, ru, ua };

class I18nPlugin extends I18nPluginDefault {
  // You can redefine some part of default class here
}

export default new I18nPlugin(messages);
