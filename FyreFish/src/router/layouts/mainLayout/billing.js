import i18n from "@/plugins/vue-i18n";

const Billing = () => import(/* webpackChunkName: "billing" */ "@/views/billing/index");
const MakePayment = () => import(/* webpackChunkName: "billing" */ "@/views/billing/makePayment");
const AddCreditCard = () =>
  import(/* webpackChunkName: "billing" */ "@/views/billing/addCreditCard");
const AddBankAccount = () =>
  import(/* webpackChunkName: "billing" */ "@/views/billing/addBankAccount");
const PaymentConfirmation = () =>
  import(/* webpackChunkName: "billing" */ "@/views/billing/paymentConfirmation");
const SubmitPayment = () =>
  import(/* webpackChunkName: "billing" */ "@/views/billing/submitPayment");

const billing = [
  {
    path: "billing",
    name: "Billing",
    component: Billing,
    meta: {
      title: i18n.t("title.billing"),
    },
  },
  {
    path: "billing/credit-card/add",
    name: "AddCreditCard",
    component: AddCreditCard,
    meta: {
      title: i18n.t("title.addCreditCard"),
    },
  },
  {
    path: "billing/bank-account/add",
    name: "AddBankAccount",
    component: AddBankAccount,
    meta: {
      title: i18n.t("title.addBankAccount"),
    },
  },
  {
    path: "billing/payment-confirmation",
    name: "PaymentConfirmation",
    component: PaymentConfirmation,
    meta: {
      title: i18n.t("title.paymentConfirmation"),
    },
  },
  {
    path: "billing/submit-payment",
    name: "SubmitPayment",
    component: SubmitPayment,
    meta: {
      title: i18n.t("title.submitPayment"),
    },
  },
  {
    path: "billing/make-payment",
    name: "MakePayment",
    component: MakePayment,
    meta: {
      title: i18n.t("title.makePayment"),
    },
  },
];

export default billing;
