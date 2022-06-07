export default class I18nServiceDefault {
  static FALLBACK_LOCALE = "en";
  static LOCALE_KEY = "language";
  static GLOBAL_COMPONENT_PREFIX = "component";

  constructor(translate, options = {}) {
    this._$t = translate;
    this._componentName = options?.componentName;
  }

  /**
   * Get translation from global i18n file (if exists), else get it from component's <i18n> tag.
   * @param localPath { string }
   * @returns string
   */
  getTranslation = (localPath) => {
    if (!this._componentName || !localPath) {
      return "";
    }

    const globalComponentPrefix = I18nServiceDefault.GLOBAL_COMPONENT_PREFIX;
    const globalPrefix = `${globalComponentPrefix}.${this._componentName}`;
    const globalPath = `${globalPrefix}.${localPath}`;

    return !this._$t(globalPath).startsWith(globalPrefix)
      ? this._$t(globalPath)
      : this._$t(localPath);
  };

  /**
   * Save the active language to the localStorage
   * @param lang
   */
  static setActiveLanguage(lang) {
    const localeKey = I18nServiceDefault.LOCALE_KEY;

    localStorage.setItem(localeKey, lang);
  }

  /**
   * Get the current active language from localStorage or set default if non exist
   * @returns {string | string}
   */
  static getActiveLanguage() {
    const localeKey = I18nServiceDefault.LOCALE_KEY;
    const fallbackLocale = I18nServiceDefault.FALLBACK_LOCALE;

    return localStorage.getItem(localeKey) || fallbackLocale;
  }
}
