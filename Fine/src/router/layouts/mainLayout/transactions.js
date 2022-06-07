import i18n from "@/plugins/vue-i18n";

const TransactionsList = () =>
  import(/* webpackChunkName: "transaction" */ "@/views/transactions/index");
const TransactionsAdd = () =>
  import(/* webpackChunkName: "transaction" */ "@/views/transactions/add");
const TransactionsFilter = () =>
  import(/* webpackChunkName: "transaction" */ "@/views/transactions/filter");
const TransactionsEdit = () =>
  import(/* webpackChunkName: "transaction" */ "@/views/transactions/edit");

let transactions = [
  {
    path: "transactions",
    name: "TransactionsList",
    component: TransactionsList,
    meta: {
      title: i18n.t("title.transaction.list"),
    },
  },
  {
    path: "transactions/filter",
    name: "TransactionsFilter",
    component: TransactionsFilter,
    meta: {
      title: i18n.t("title.filter"),
    },
  },
  {
    path: "transactions/0",
    name: "TransactionsAdd",
    component: TransactionsAdd,
    meta: {
      title: i18n.t("title.transaction.add"),
    },
  },
  {
    path: "transactions/:id",
    name: "TransactionsEdit",
    component: TransactionsEdit,
    meta: {
      title: i18n.t("title.transaction.edit"),
    },
  },
];

export default transactions;
