import idb from "@/plugins/vue-idb-keyval";
import router from "@/router";
import {
  addAccount,
  getAccount,
  getAccounts,
  updateAccount,
  updateAccountSort,
  deleteAccount,
} from "@/api/bankAccount";
import DataService from "@/services/data.service";

export default {
  namespaced: true,

  state: {
    account: null,
    accountId: null,
    accounts: [],
  },

  getters: {
    bankAccountsCurrencies(state) {
      const accountCurrencyId = state.accounts.map((item) => item.currency.id);
      const uniqueCurrencyIds = accountCurrencyId.filter(
        (item, index) => accountCurrencyId.indexOf(item) === index
      );

      return uniqueCurrencyIds;
    },

    bankAccountsForSelect(state) {
      const accounts = state.accounts;

      return accounts.map((item) => ({
        id: item.id,
        label: item.name,
        currencySymbol: item.currency.symbol,
        currencyId: item.currency.id,
      }));
    },

    bankAccountsGroupedByCompanies(state, getters, rootState) {
      const companies = rootState.company.companies;

      return companies.map((company) => {
        let companyBankAccounts = state.accounts.map((account) => {
          if (account.company.id === company.id) {
            return {
              id: account.id,
              label: `${account.name}, ${account.currency.symbol}`,
              company: company.name,
            };
          }
        });

        companyBankAccounts = companyBankAccounts.filter((company) => company);

        return {
          company: company.name,
          accounts: companyBankAccounts,
        };
      });
    },

    bankAccounts(state) {
      const accountsGroupedByCompany = [];

      const optionsBuilder = (option) => {
        return {
          id: option.id,
          label: `${option.name}, ${option.currency.symbol} / ${option.bank.name}`,
          ...option,
        };
      };

      state.accounts.forEach((bankAccount) => {
        const index = accountsGroupedByCompany.findIndex(
          (item) => item.id === bankAccount.company.id
        );

        if (~index) {
          accountsGroupedByCompany[index].options.push(optionsBuilder(bankAccount));
        } else {
          accountsGroupedByCompany.push({
            id: bankAccount.company.id,
            label: bankAccount.company.name,
            options: [optionsBuilder(bankAccount)],
          });
        }
      });

      return accountsGroupedByCompany;
    },
  },

  mutations: {
    SET_ACCOUNT(state, account = null) {
      state.account = account;
    },

    SET_ACCOUNT_ID(state, accountId) {
      state.accountId = accountId;
    },

    SET_ACCOUNTS(state, accounts) {
      if (accounts.length) {
        state.accounts = accounts.sort(DataService.compareValues("sort"));
      } else if (!Array.isArray(accounts)) {
        state.accounts.push(accounts);
      }
    },

    UPDATE_ACCOUNT(state, account) {
      state.accounts = DataService.updateArray(state.accounts, [account]);
    },

    DELETE_ACCOUNT(state, accountId) {
      state.accounts = state.accounts.filter((account) => account.id !== accountId);
    },
  },

  actions: {
    async getAccount(context, accountId) {
      if (!accountId) return;

      const response = await getAccount(accountId);

      context.commit("SET_ACCOUNT", response);
    },

    async getAccounts(context) {
      if (context.state.accounts.length) return;

      const idbAccounts = await idb.get("accounts");
      const isPresentIdbData = !!idbAccounts?.length;

      if (isPresentIdbData) {
        context.commit("SET_ACCOUNTS", idbAccounts);
      }

      const response = await getAccounts(!isPresentIdbData);

      context.commit("SET_ACCOUNTS", response);

      await idb.set("accounts", response);
    },

    async addAccount(context, account) {
      const response = await addAccount(account);

      context.commit("SET_ACCOUNT_ID", response.id);
      context.commit("SET_ACCOUNTS", response);

      await idb.set("accounts", context.state.accounts);
    },

    async updateAccount(context, account) {
      const response = await updateAccount(account);

      context.commit("UPDATE_ACCOUNT", response);

      await idb.set("accounts", context.state.accounts);
    },

    async updateAccountSort(context, accounts) {
      await updateAccountSort(accounts);
    },

    async deleteAccount(context, { accountId, currentRoute, delaySuccessNotify = false }) {
      await deleteAccount(accountId, delaySuccessNotify);

      context.commit("DELETE_ACCOUNT", accountId);

      await idb.set("accounts", context.state.accounts);

      if (currentRoute !== "AccountList") {
        await router.push({ name: "AccountList" });
      }
    },
  },
};
