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

  removeOutlineFocus() {
    let focusRing = true;

    document.head.appendChild(document.createElement("style")).innerHTML =
      "body.hide-focus-ring *:focus { outline: none !important; }";

    document.addEventListener("mousedown", function focusRingHandler() {
      if (focusRing) {
        document.body.classList.add("hide-focus-ring");
      }

      focusRing = false;
    });

    document.addEventListener("keydown", function focusRingHandler() {
      if (!focusRing) {
        document.body.classList.remove("hide-focus-ring");
      }

      focusRing = true;
    });
  }
}

export const { getTheme, getThemeName, getRandomId, removeOutlineFocus, isPWA } =
  new UiServiceDefault();
export { layout, notify };
