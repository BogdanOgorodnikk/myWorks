import { theme, layout, notify } from "@/configs/ourApp.config";

export default class UiServiceDefault {
  isPWA = false;

  constructor() {
    this.isPWA = this.#isPWA();
  }

  #isPWA() {
    return !!navigator.standalone;
  }

  // TODO: rename to >>> getTheme
  getThemeName() {
    return theme || "";
  }

  // TODO: rename to >>> getThemeClass
  getTheme() {
    return theme ? `${theme}-theme` : "";
  }

  getRandomId(idLength = 15) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charactersLength = characters.length;
    let id = "";

    while (id.length < idLength) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return id;
  }
}

export const { getTheme, getThemeName, getRandomId, isPWA } = new UiServiceDefault();
export { layout, notify };
