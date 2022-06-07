import Vue from "vue";
import VueI18n from "vue-i18n";
import I18nServiceDefault from "@ilevel/our.service.i18n";

export default class I18nPluginDefault {
  #messages;
  #fallbackLocale;

  constructor(messages, settings = {}) {
    this.#messages = messages;
    this.#fallbackLocale = settings?.fallbackLocale || I18nServiceDefault.FALLBACK_LOCALE;

    return this.init();
  }

  init() {
    Vue.use(VueI18n);

    return new VueI18n({
      messages: this.#messages,
      locale: I18nServiceDefault.getActiveLanguage(),
      fallbackLocale: this.#fallbackLocale,
      silentTranslationWarn: true,
      missing: this.missing,
      pluralizationRules: {
        ru: this.pluralizationRules,
        ua: this.pluralizationRules,
      },
    });
  }

  missing(locale, key) {
    const isProduction = process.env.NODE_ENV !== "production";
    const globalComponentPrefix = I18nServiceDefault.GLOBAL_COMPONENT_PREFIX;

    // suppress translation warnings for super-global components
    if (!key.startsWith(`${globalComponentPrefix}.`) && isProduction) {
      // eslint-disable-next-line no-console
      console.warn("Translation is missing:", key);
    }
  }

  pluralizationRules(value, plurals) {
    let pluralIndex = 0;

    if (value) {
      const remainder = value % 10;
      const teen = value > 10 && value < 20;
      const endsWithOne = remainder === 1;

      if (plurals < 4) {
        pluralIndex = !teen && endsWithOne ? 1 : 2;
      } else {
        pluralIndex = 3;
        if (!teen && endsWithOne) pluralIndex = 1;
        if (!teen && remainder >= 2 && remainder <= 4) pluralIndex = 2;
      }
    }

    return pluralIndex;
  }
}
