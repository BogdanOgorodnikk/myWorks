import Meta from "@/router/meta";

const META_SEPARATOR = " / ";

export default (to, from) => {
  // Meta data service
  if (to.name === "Invoice") {
    Meta.setDocumentMeta("", "", to, from);
  } else {
    Meta.setDocumentMeta(META_SEPARATOR, "Fyrefish", to, from);
  }

  // Scroll up when all page is loaded
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
};
