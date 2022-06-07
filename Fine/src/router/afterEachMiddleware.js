import Meta from "@/router/meta";
import store from "@/store";

const META_SEPARATOR = " / ";

export default (to, from) => {
  // Meta data service
  Meta.setDocumentMeta(META_SEPARATOR, "Finé", to, from);

  // Scroll up when all page is loaded
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);

  store.commit("loader/SET_RENDERING_FINISHED");
};
