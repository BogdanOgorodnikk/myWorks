import Vue from "vue";
import VueI18n from "vue-i18n";

export default class i18nPluginDefault {
  #messages = {};
  #fallbackLocale = "en";
  #localStorageLocaleKey = "language";

  constructor(messages, settings = {}) {
    this.#messages = messages;
    this.#fallbackLocale = settings?.fallbackLocale || this.#fallbackLocale;
    this.#localStorageLocaleKey = settings?.localStorageLocaleKey || this.#localStorageLocaleKey;

    return this.init();
  }

  init() {
    Vue.use(VueI18n);

    return new VueI18n({
      messages: this.#messages,
      locale: localStorage.getItem(this.#localStorageLocaleKey) || this.#fallbackLocale,
      fallbackLocale: this.#fallbackLocale,
      pluralizationRules: {
        ru: this.pluralizationRules,
        ua: this.pluralizationRules,
      },
    });
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
