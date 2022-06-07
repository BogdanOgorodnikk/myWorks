import i18n from "@/plugins/vue-i18n";

const SignUp = () => import(/* webpackChunkName: "auth" */ "@/views/auth/signUp");
const Products = () => import(/* webpackChunkName: "auth" */ "@/views/auth/signUp/Products");
const UserInformation = () =>
  import(/* webpackChunkName: "auth" */ "@/views/auth/signUp/UserInformation");
const Payment = () => import(/* webpackChunkName: "auth" */ "@/views/auth/signUp/Payment");
const Success = () => import(/* webpackChunkName: "auth" */ "@/views/auth/signUp/Success");

const signup = [
  {
    path: "/signup",
    name: "SignUpBuildings",
    component: SignUp,
    meta: {
      title: i18n.t("title.signUp"),
    },
  },
  {
    path: "/signup",
    name: "SignUpProducts",
    component: Products,
    meta: {
      title: i18n.t("title.signUp"),
    },
  },
  {
    path: "/signup",
    name: "SignUpUserInformation",
    component: UserInformation,
    meta: {
      title: i18n.t("title.signUp"),
    },
  },
  {
    path: "/signup",
    name: "SignUpPayment",
    component: Payment,
    meta: {
      title: i18n.t("title.signUp"),
    },
  },
  {
    path: "/signup",
    name: "SignUpSuccess",
    component: Success,
    meta: {
      title: i18n.t("title.signUp"),
    },
  },
];

export default signup;
