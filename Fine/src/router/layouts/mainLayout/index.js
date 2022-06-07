import store from "@/store";
import ApiService from "@/services/api.service";
import QS from "qs";

import transactions from "./transactions";
import settings from "./setting";
import contragents from "./contragents";
import reports from "./reports";

const AdminLayout = () => import(/* webpackChunkName: "adminLayout" */ "@/layouts/_bit/admin");

const mainLayout = [
  {
    path: "/:businessName",
    name: "MainLayout",
    redirect: { name: "TransactionsList" },
    component: AdminLayout,
    children: [...transactions, ...settings, ...contragents, ...reports],
    beforeEnter: async (to, from, next) => {
      ApiService.setBusinessUrl(to.params.businessName);

      const authorisedBusinessName = localStorage.getItem("businessName");

      authorisedBusinessName !== to.params.businessName
        ? await next({ name: "BusinessLayout" })
        : await store.dispatch("settings/getSettings");

      const transactionsPage = "TransactionsList";
      const transactionId = to.query?.id || "";

      if (to.name === transactionsPage && transactionId) {
        next({
          name: "TransactionsEdit",
          params: { id: transactionId, businessName: to.params.businessName },
          query: { type: to.query.type },
        });
      }

      const transactionFilters = to.query?.filters || "";

      if (to.name === transactionsPage && transactionFilters) {
        const filters = QS.parse(transactionFilters);

        store.commit("transaction/SET_FILTERS", filters);
      }

      next();
    },
  },
];

export default mainLayout;
