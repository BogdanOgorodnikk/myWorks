import i18n from "@/plugins/vue-i18n";

const ContactUs = () => import(/* webpackChunkName: "auth" */ "@/views/auth/contactUs");

const contactUs = [
  {
    path: "/contact-us",
    name: "ContactUs",
    component: ContactUs,
    meta: {
      title: i18n.t("title.contactUs"),
    },
  },
];

export default contactUs;
