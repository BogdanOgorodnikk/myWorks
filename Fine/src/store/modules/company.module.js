import idb from "@/plugins/vue-idb-keyval";
import router from "@/router";
import {
  getCompany,
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  updateCompanySort,
} from "@/api/company";
import DataService from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    company: null,
    companies: [],
  },

  getters: {
    companiesForSelect(state) {
      const companies = state.companies;

      return companies.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_COMPANY(state, company = null) {
      state.company = company;
    },

    SET_COMPANIES(state, companies) {
      if (companies.length) {
        state.companies = companies.sort(DataService.compareValues("sort"));
      } else if (!Array.isArray(companies)) {
        state.companies.push(companies);
      }
    },

    UPDATE_COMPANY(state, company) {
      state.companies = DataService.updateArray(state.companies, [company]);
    },

    DELETE_COMPANY(state, companyId) {
      state.companies = state.companies.filter((company) => company.id !== companyId);
    },
  },

  actions: {
    async getCompany(context, companyId) {
      if (!companyId) return;

      const response = await getCompany(companyId);

      context.commit("SET_COMPANY", response);
    },

    async getCompanies(context) {
      if (context.state.companies.length) return;

      const idbCompanies = await idb.get("companies");
      const isPresentIdbData = !!idbCompanies?.length;

      if (isPresentIdbData) {
        context.commit("SET_COMPANIES", idbCompanies);
      }

      const response = await getCompanies(!isPresentIdbData);

      context.commit("SET_COMPANIES", response);

      await idb.set("companies", response);
    },

    async addCompany(context, company) {
      const response = await addCompany(company);

      context.commit("SET_COMPANIES", response);

      await idb.set("companies", context.state.companies);

      await router.push({ name: "CompanyList" });
    },

    async updateCompany(context, company) {
      const response = await updateCompany(company);

      context.commit("UPDATE_COMPANY", response);

      await idb.set("companies", context.state.companies);

      await router.push({ name: "CompanyList" });
    },

    async updateCompanySort(context, companies) {
      await updateCompanySort(companies);
    },

    async deleteCompany(context, { companyId, currentRoute, delaySuccessNotify = false }) {
      await deleteCompany(companyId, delaySuccessNotify);

      context.commit("DELETE_COMPANY", companyId);

      await idb.set("companies", context.state.companies);

      if (currentRoute !== "CompanyList") {
        await router.push({ name: "CompanyList" });
      }
    },
  },
};
