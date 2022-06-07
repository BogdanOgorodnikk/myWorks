export default class i18nServiceDefault {
  static fallbackLocale = "en";

  /**
   * Save the active language to the localStorage
   * @param lang
   */
  static setActiveLanguage(lang) {
    localStorage.setItem("language", lang);
  }

  /**
   * Get the current active language from localStorage
   * @returns {string | string}
   */
  static getActiveLanguage() {
    return localStorage.getItem("language") || this.fallbackLocale;
  }
}
