import {
  getTransactions,
  getExchangeRate,
  getTransaction,
  getTotalsBalance,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  massUpdateTransactions,
  massDeleteTransactions,
  getCalendarTransactions,
  getTotalsTransactions,
  addTransfer,
  divideTransferTransaction,
  mergeTransactionIntoTransfer,
  updateTransfer,
} from "@/api/transaction";
import DataService from "@/services/data.service";
import { fromUnixTime, getDate, getMonth, getYear } from "date-fns";
import { TRANSACTION_TYPE } from "@/api/transaction";
import i18n from "@/plugins/vue-i18n";
import { checkSuitabilityFilters } from "@/views/transactions/_services/transactionFilter.service";
import DateService from "@/services/date.service";
import MoneyService from "@/services/money.service";
import { MONEY_SIGN_TYPE } from "@ilevel/our.service.money";

export default {
  namespaced: true,

  state: {
    transaction: null,
    transactions: [],
    calendarTransactions: [],
    totalPlannedTransactions: null,
    isShownPlannedTransactions: false,
    transactionsMeta: {},
    exchangeRate: 0,
    filters: {},
    transactionsTotals: [],
    totalsBalance: [],
  },

  getters: {
    transactionsChildren(state) {
      const transactions = state.transactions;
      let childrenTransactions = [];

      transactions.forEach((item) => {
        if (item.parentId) {
          childrenTransactions.push(item);
        } else if (item.children) {
          item.children.reverse().forEach((children) => {
            childrenTransactions.push({ parentId: item.id, isNewChildren: true, ...children });
          });
        }
      });

      const mainTransactions = transactions.filter((item) => !item.parentId && !item.transferId);

      const transactionsWithPrefilledChildren = mainTransactions.map((item) => {
        let children = childrenTransactions.filter((child) => child.parentId === item.id).reverse();
        const hasNewChildren = children.some((item) => item.isNewChildren);

        children = hasNewChildren ? children.filter((item) => item.isNewChildren) : children;

        if (children.length) {
          const childrenWithData = {
            parentId: item.id,
            category: [],
            counteragent: [],
            accrualDate: [],
            money: [],
            child: [],
          };

          children.forEach((child) => {
            childrenWithData.counteragent.push(child.counterparty?.name);
            childrenWithData.accrualDate.push(child.accrualDate);

            childrenWithData.category.push({
              category: child.category?.name || "",
              project: child.project?.name || "",
            });

            childrenWithData.money.push({
              type: child.category.type,
              sum: child.sum,
              currencyId: item.bankAccount.currency.id,
              currencySymbol: item.bankAccount.currency.symbol,
              obligation: MoneyService.setMoneyObligation(
                item.paymentDate,
                child.accrualDate,
                child.category.type
              ),
            });

            childrenWithData.child.push(child);
          });

          return childrenWithData;
        }
      });

      return transactionsWithPrefilledChildren.filter((item) => item);
    },

    transactionsForMobileTable(state) {
      const MONTHES_LOCALES = [
        i18n.t("label.month.january"),
        i18n.t("label.month.february"),
        i18n.t("label.month.march"),
        i18n.t("label.month.april"),
        i18n.t("label.month.may"),
        i18n.t("label.month.june"),
        i18n.t("label.month.july"),
        i18n.t("label.month.august"),
        i18n.t("label.month.september"),
        i18n.t("label.month.october"),
        i18n.t("label.month.november"),
        i18n.t("label.month.december"),
      ];

      const EMPTY_ITEM_SYMBOL = "-";

      const transactions = [...state.transactions];
      const parentTransactions = transactions.filter((item) => !item.parentId);
      const childrenTransactions = transactions.filter((item) => item.parentId);

      let preparedTransactions = [];

      parentTransactions.forEach((transaction) => {
        const date = fromUnixTime(transaction.paymentDate);
        const preparedDate = `${getDate(date)} ${MONTHES_LOCALES[getMonth(date)]} ${getYear(date)}`;

        const duplicatedTransactionDate = preparedTransactions.find(
          (item) => item.date === preparedDate
        );

        let items = [];

        if (!duplicatedTransactionDate) {
          parentTransactions.forEach((item) => {
            if (item.paymentDate === transaction.paymentDate) {
              const itemChildren = childrenTransactions.filter(
                (child) => child.parentId === item.id
              );

              let divideCategoryName = "";

              if (itemChildren.length) {
                const isSimilarCategory = itemChildren.every(
                  (el) => el.category.id === itemChildren[0].category.id
                );

                if (isSimilarCategory) {
                  divideCategoryName = itemChildren[0].category.name;
                } else {
                  divideCategoryName = i18n.t("label.multipleCategoriesListed");
                }
              }

              items.push({
                id: item.id,
                title: item.description || EMPTY_ITEM_SYMBOL,
                descriptions: divideCategoryName || item.category.name,
                money: {
                  type: item.category.type,
                  sum: item.sum,
                  currencyId: item.bankAccount.currency.id,
                  currencySymbol: item.bankAccount.currency.symbol,
                },
              });
            }
          });

          preparedTransactions.push({
            date: preparedDate,
            items,
          });
        }
      });

      return preparedTransactions;
    },

    transactionsForTable(state, getters, rootState, rootGetters) {
      const EMPTY_ITEM_SYMBOL = "-";

      const transactions = state.transactions
        .sort(DataService.compareValues("createdAt", "desc"))
        .sort(DataService.compareValues("paymentDate", "desc"));

      const childrenTransactions = getters.transactionsChildren;
      const transferTransactions = transactions.filter((item) => item.transferId);
      const mainTransactions = transactions.filter(
        (item) => (!item.parentId && !item.transferId) || (item.transferId && !item.isPositive)
      );

      return mainTransactions.map((item) => {
        const isPlannedTransaction =
          item.paymentDate >= DateService.TOMORROW_TIMESTAMP || !item.paymentConfirmed;

        let tags = [];

        if (item.tags.length) {
          tags = item.tags.map((tag) => `#${tag.name}`);
        }

        if (item.transferId) {
          const acceptingTransferTransaction =
            transferTransactions.find((transaction) => transaction.transferId === item.id) || {};

          return {
            isChecked: false,
            id: item.id,
            date: {
              primaryRow: item.paymentDate,
            },
            money: {
              primaryRow: {
                type: TRANSACTION_TYPE.expense,
                sum: item.sum,
                currencyId: item.bankAccount.currency.id,
                currencySymbol: item.bankAccount.currency.symbol,
                categoryType: item.category.type,
                sign: MONEY_SIGN_TYPE.negative,
              },
              secondaryRow: {
                type: TRANSACTION_TYPE.income,
                sum: acceptingTransferTransaction?.sum,
                currencyId: acceptingTransferTransaction?.bankAccount?.currency?.id,
                currencySymbol: acceptingTransferTransaction?.bankAccount?.currency?.symbol,
                sign: MONEY_SIGN_TYPE.positive,
              },
              isPlannedTransaction,
            },
            details: {
              primaryRow: item.description || EMPTY_ITEM_SYMBOL,
              secondaryRow: {
                category: rootGetters["category/nameChainNestedCategories"](item.category.id),
                project: item.project?.name || "",
                tags,
              },
            },
            counteragent: item.counterparty?.name || "",
            requisites: {
              primaryRowTransfer: {
                bankAccount: `${item.bankAccount.name}, ${item.bankAccount.currency.symbol}`,
                company: `${i18n.t("label.in")} ${item.bankAccount.company.name}`,
              },
              secondaryRowTransfer: {
                bankAccount: `${acceptingTransferTransaction?.bankAccount?.name},
                  ${acceptingTransferTransaction?.bankAccount?.currency?.symbol}`,
                company: `${i18n.t("label.in")} ${
                  acceptingTransferTransaction?.bankAccount?.company?.name
                }`,
              },
            },
          };
        }

        const children = childrenTransactions.find((child) => child.parentId === item.id);

        if (children) {
          const [firstChild] = children.child;

          tags = firstChild.tags.map((tag) => `#${tag.name}`);
        }

        const detailsSecondaryRow = children?.category?.length
          ? {
              children: children.category,
              tags,
            }
          : {
              category: rootGetters["category/nameChainNestedCategories"](item.category.id),
              project: item.project?.name || "",
              tags,
            };

        return {
          isChecked: false,
          id: item.id,
          date: {
            primaryRow: item.paymentDate,
            secondaryRow: children?.accrualDate?.length ? children.accrualDate : item.accrualDate,
          },
          money: {
            primaryRow: {
              type: item.category.type,
              sum: item.sum,
              currencyId: item.bankAccount.currency.id,
              currencySymbol: item.bankAccount.currency.symbol,
              categoryType: item.category.type,
              obligation: !children?.accrualDate?.length
                ? MoneyService.setMoneyObligation(
                    item.paymentDate,
                    item.accrualDate,
                    item.category.type
                  )
                : "",
              sign:
                item.category.type === TRANSACTION_TYPE.income
                  ? MONEY_SIGN_TYPE.positive
                  : MONEY_SIGN_TYPE.negative,
            },
            secondaryRow: children?.money || [],
            isPlannedTransaction,
          },
          details: {
            primaryRow: item.description || EMPTY_ITEM_SYMBOL,
            secondaryRow: detailsSecondaryRow,
          },
          counteragent: {
            primaryRow: item.counterparty?.name || EMPTY_ITEM_SYMBOL,
            secondaryRow: children?.counteragent || [],
          },
          requisites: {
            primaryRow: `${item.bankAccount.name}, ${item.bankAccount.currency.symbol}`,
            secondaryRow: item.bankAccount.company.name || "",
          },
        };
      });
    },

    moneyTotals(state) {
      const moneyTotals = state.totalsBalance?.factual?.totals;

      const amounts = moneyTotals?.byCurrencies.map((money) => ({
        sum: money?.balance,
        currencySymbol: money?.currency?.symbol,
      }));

      return {
        generalAmount: {
          sum: moneyTotals?.inBaseCurrency?.balance,
          currencySymbol: moneyTotals?.inBaseCurrency?.currency?.symbol,
        },
        otherAmounts: amounts,
      };
    },
  },

  mutations: {
    SET_TRANSACTION(state, transaction = null) {
      state.transaction = transaction;
    },

    SET_TRANSACTIONS(state, { transactions, getters }) {
      const tableTransactions = getters?.transactionsForTable;
      const isActiveFilters = Object.keys(state.filters).length >= 2;
      const paymentDateRange = state.filters.paymentDate;

      let isTransactionInRange = false;
      let isPlannedTransaction = false;

      if (tableTransactions) {
        const paymentDateRangeTo =
          paymentDateRange.from >= DateService.TOMORROW_TIMESTAMP ||
          paymentDateRange.to <= DateService.TOMORROW_TIMESTAMP
            ? paymentDateRange.to
            : DateService.TOMORROW_TIMESTAMP;

        isTransactionInRange =
          transactions.paymentDate <= paymentDateRangeTo &&
          transactions.paymentDate >= paymentDateRange.from;

        isPlannedTransaction =
          state.isShownPlannedTransactions && transactions.paymentDate <= paymentDateRange.to;
      }

      if (transactions === null) {
        return (state.transactions = []);
      }

      if (isTransactionInRange) {
        if (isActiveFilters) {
          const isFiltered = checkSuitabilityFilters(state.filters, transactions);

          if (isFiltered) {
            return (state.transactions = [...state.transactions, transactions]);
          }
        } else {
          return (state.transactions = [...state.transactions, transactions]);
        }
      }

      if (isPlannedTransaction) {
        return (state.transactions = [...state.transactions, transactions]);
      }

      if (Array.isArray(transactions)) {
        const filteredTransactions = transactions.filter((transaction) => {
          const repeatedElement = state.transactions.find((item) => item.id === transaction.id);

          return !repeatedElement;
        });

        state.transactions = [...state.transactions, ...filteredTransactions];
      }

      if (Array.isArray(tableTransactions) && !tableTransactions.length) {
        state.transactions = [transactions];
      }
    },

    SET_TRANSACTIONS_TOTALS(state, transactionsTotals) {
      state.transactionsTotals = transactionsTotals;
    },

    UPDATE_TRANSACTION(state, newTransaction) {
      const paymentDateRange = state.filters.paymentDate;
      const isActiveFilters = Object.keys(state.filters).length >= 2;

      const isDateRangeWithToday =
        paymentDateRange.from <= DateService.TOMORROW_TIMESTAMP &&
        paymentDateRange.to >= DateService.TOMORROW_TIMESTAMP;
      const paymentDateRangeTo =
        isDateRangeWithToday && !state.isShownPlannedTransactions
          ? DateService.TOMORROW_TIMESTAMP
          : paymentDateRange.to;
      const inPaymentDateRange =
        newTransaction.paymentDate >= paymentDateRange.from &&
        newTransaction.paymentDate <= paymentDateRangeTo;

      let isFiltered = false;

      if (isActiveFilters) {
        isFiltered = checkSuitabilityFilters(state.filters, newTransaction);
      }

      if (isFiltered && inPaymentDateRange) {
        state.transactions = DataService.updateArray(state.transactions, [newTransaction]);
      } else if (inPaymentDateRange) {
        state.transactions = DataService.updateArray(state.transactions, [newTransaction]);
      } else {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== newTransaction.id
        );
      }
    },

    UPDATE_TRANSACTIONS(state, newTransactions) {
      const isActiveFilters = Object.keys(state.filters).length >= 2;
      const paymentDateRange = state.filters.paymentDate;
      const [firstUpdatedTransaction] = newTransactions;
      const isDateRangeWithToday =
        paymentDateRange.from <= DateService.TOMORROW_TIMESTAMP &&
        paymentDateRange.to >= DateService.TOMORROW_TIMESTAMP;
      const paymentDateRangeTo =
        isDateRangeWithToday && !state.isShownPlannedTransactions
          ? DateService.TOMORROW_TIMESTAMP
          : paymentDateRange.to;
      const inPaymentDateRange =
        firstUpdatedTransaction.paymentDate >= paymentDateRange.from &&
        firstUpdatedTransaction.paymentDate <= paymentDateRangeTo;

      let isFiltered = false;

      if (isActiveFilters) {
        isFiltered = checkSuitabilityFilters(state.filters, firstUpdatedTransaction);
      }

      if (isFiltered && inPaymentDateRange) {
        state.transactions = DataService.updateArray(state.transactions, newTransactions);
      } else if (inPaymentDateRange) {
        state.transactions = DataService.updateArray(state.transactions, newTransactions);
      } else {
        let transactions = [];

        state.transactions.forEach((transaction) => {
          const updatedTransaction = newTransactions.find((item) => item.id === transaction.id);

          if (!updatedTransaction) {
            transactions.push(transaction);
          }
        });

        state.transactions = transactions;
      }
    },

    SET_EXCHANGE_RATE(state, rate) {
      state.exchangeRate = rate;
    },

    SET_FILTERS(state, filters) {
      state.filters = filters;
    },

    SET_SHOWN_PLANNED_TRANSACTIONS(state, isShownPlannedTransactions) {
      state.isShownPlannedTransactions = isShownPlannedTransactions;
    },

    SET_TOTAL_PLANNED_TRANSACTIONS(state, { totalPlannedTransactions, transaction }) {
      const paymentDateRange = state.filters.paymentDate;
      const isActiveFilters = Object.keys(state.filters).length >= 2;
      let isPlannedTransaction = false;

      if (typeof transaction === "object") {
        isPlannedTransaction =
          transaction.paymentDate > DateService.TOMORROW_TIMESTAMP &&
          transaction.paymentDate <= paymentDateRange.to &&
          DateService.TOMORROW_TIMESTAMP > paymentDateRange.from &&
          DateService.TOMORROW_TIMESTAMP < paymentDateRange.to;
      }

      if (isPlannedTransaction) {
        if (isActiveFilters) {
          const isFiltered = checkSuitabilityFilters(state.filters, transaction);

          if (isFiltered) {
            return (state.totalPlannedTransactions += 1);
          }
        } else {
          return (state.totalPlannedTransactions += 1);
        }
      }

      if (totalPlannedTransactions >= 0) {
        state.totalPlannedTransactions = totalPlannedTransactions;
      }
    },

    SET_TRANSACTIONS_META(state, meta) {
      state.transactionsMeta = meta;
    },

    SET_CALENDAR_TRANSACTIONS(state, calendarTransactions) {
      if (Array.isArray(calendarTransactions)) {
        state.calendarTransactions = calendarTransactions;
      } else {
        state.calendarTransactions = [];
      }
    },

    SET_TOTALS_BALANCE(state, totalsBalance) {
      state.totalsBalance = totalsBalance;
    },

    DELETE_TRANSACTION(state, transactionId) {
      const paymentDateRange = state.filters.paymentDate;

      const deletedTransaction = state.transactions.find(
        (transaction) => transaction.id === transactionId
      );

      if (
        deletedTransaction.paymentDate > DateService.TOMORROW_TIMESTAMP &&
        paymentDateRange.from < DateService.TOMORROW_TIMESTAMP &&
        paymentDateRange.to > DateService.TOMORROW_TIMESTAMP
      ) {
        state.totalPlannedTransactions--;
      }

      state.transactions = state.transactions.filter(
        (transaction) =>
          transaction.id !== transactionId && transaction.id !== deletedTransaction.transferId
      );
    },

    DELETE_TRANSACTIONS(state, transactionIds) {
      const paymentDateRange = state.filters.paymentDate;

      transactionIds.forEach((id) => {
        state.transactions.forEach((transaction, index) => {
          if (transaction.id === id) {
            if (
              transaction.paymentDate > DateService.TOMORROW_TIMESTAMP &&
              paymentDateRange.from < DateService.TOMORROW_TIMESTAMP &&
              paymentDateRange.to > DateService.TOMORROW_TIMESTAMP
            ) {
              state.totalPlannedTransactions--;
            }

            if (transaction.transferId) {
              let transferTransactionIndex;

              transferTransactionIndex = state.transactions.findIndex(
                (transferTransaction) => transferTransaction.id === transaction.transferId
              );

              state.transactions.splice(transferTransactionIndex, 1);

              transferTransactionIndex = state.transactions.findIndex(
                (transferTransaction) => transferTransaction.id === transaction.id
              );

              state.transactions.splice(transferTransactionIndex, 1);
            } else {
              state.transactions.splice(index, 1);
            }
          }
        });
      });
    },
  },

  actions: {
    async getTransactions(
      context,
      { params, withCleanTransactions, withCleanPlannedTransactions }
    ) {
      const response = await getTransactions(params);

      if (withCleanTransactions) {
        context.commit("SET_TRANSACTIONS", { transactions: null });
      }

      if (withCleanPlannedTransactions) {
        context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", { totalPlannedTransactions: 0 });
        context.commit("SET_SHOWN_PLANNED_TRANSACTIONS", false);
      }

      context.commit("SET_TRANSACTIONS", { transactions: response.data });
      context.commit("SET_TRANSACTIONS_META", response.meta);
    },

    async getPlannedTransactions(context, params) {
      const response = await getTransactions(params);

      context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", {
        totalPlannedTransactions: response.meta.total,
      });
    },

    async getExchangeRate(context, { date, currencyCode }) {
      const response = getExchangeRate(date, currencyCode);

      context.commit("SET_EXCHANGE_RATE", response);
    },

    async getTransaction(context, itemId) {
      const response = await getTransaction(itemId);

      context.commit("SET_TRANSACTION", response);
    },

    async getCalendarTransactions(context, params) {
      const response = await getCalendarTransactions(params);

      context.commit("SET_CALENDAR_TRANSACTIONS", response);
    },

    async getTotalsTransactions(context) {
      const response = await getTotalsTransactions();

      context.commit("SET_TRANSACTIONS_TOTALS", response);
    },

    async getTotalsBalance(context) {
      const response = await getTotalsBalance();

      context.commit("SET_TOTALS_BALANCE", response);
    },

    async addTransaction(context, transaction) {
      const response = await addTransaction(transaction);

      context.commit("SET_TRANSACTIONS", { transactions: response, getters: context?.getters });
      context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", {
        transaction: response,
      });
      context.commit("SET_CALENDAR_TRANSACTIONS", null);

      context.dispatch("getTotalsBalance");
    },

    async addTransfer(context, { transaction, isConverting = false }) {
      const response = await addTransfer(transaction);
      const [intoAccountTransaction, fromAccountTransaction] = response;

      if (isConverting) {
        context.commit("DELETE_TRANSACTION", transaction.id);
      }

      context.commit("SET_TRANSACTIONS", {
        transactions: intoAccountTransaction,
        getters: context?.getters,
      });
      context.commit("SET_TRANSACTIONS", {
        transactions: fromAccountTransaction,
        getters: context?.getters,
      });
      context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", {
        transaction: intoAccountTransaction,
      });
      context.commit("SET_CALENDAR_TRANSACTIONS", null);
      context.dispatch("getTotalsBalance");
    },

    async mergeTransactionIntoTransfer(context, transactionsId) {
      const response = await mergeTransactionIntoTransfer(transactionsId);
      const [intoAccountTransaction, fromAccountTransaction] = response;

      context.commit("DELETE_TRANSACTION", transactionsId.firstId);
      context.commit("DELETE_TRANSACTION", transactionsId.secondId);

      context.commit("SET_TRANSACTIONS", {
        transactions: intoAccountTransaction,
        getters: context.getters,
      });
      context.commit("SET_TRANSACTIONS", {
        transactions: fromAccountTransaction,
        getters: context.getters,
      });
      context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", {
        transaction: intoAccountTransaction,
      });
      context.commit("SET_CALENDAR_TRANSACTIONS", null);
      context.dispatch("getTotalsBalance");
    },

    async divideTransferTransaction(context, transactionId) {
      const response = await divideTransferTransaction(transactionId);
      const [intoAccountTransaction, fromAccountTransaction] = response;

      context.commit("DELETE_TRANSACTION", transactionId);

      context.commit("SET_TRANSACTIONS", {
        transactions: intoAccountTransaction,
        getters: context.getters,
      });
      context.commit("SET_TRANSACTIONS", {
        transactions: fromAccountTransaction,
        getters: context.getters,
      });

      context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", {
        transaction: intoAccountTransaction,
      });
      context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", {
        transaction: fromAccountTransaction,
      });

      context.commit("SET_CALENDAR_TRANSACTIONS", null);

      context.dispatch("getTotalsBalance");
    },

    async updateTransaction(context, transaction) {
      const response = await updateTransaction(transaction);

      context.commit("UPDATE_TRANSACTION", response);

      const paymentDateRange = context.state.filters.paymentDate;

      if (
        context.state.isShownPlannedTransactions &&
        paymentDateRange.from < DateService.TOMORROW_TIMESTAMP &&
        paymentDateRange.to > DateService.TOMORROW_TIMESTAMP
      ) {
        const plannedTransactions = context.state.transactions.filter(
          (item) => item.paymentDate > DateService.TOMORROW_TIMESTAMP
        );

        context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", {
          totalPlannedTransactions: plannedTransactions.length,
        });
      } else {
        context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", {
          transaction: response,
        });
      }

      context.dispatch("getTotalsBalance");
    },

    async updateTransfer(context, transaction) {
      const response = await updateTransfer(transaction);

      context.commit("UPDATE_TRANSACTIONS", response);
      context.dispatch("getTotalsBalance");
    },

    async massUpdateTransactions(context, transactions) {
      const updateTransactionIds = await massUpdateTransactions(transactions);

      const params = {
        filters: {
          id: updateTransactionIds,
        },
      };

      const response = await getTransactions(params);

      context.commit("UPDATE_TRANSACTIONS", response.data);

      const paymentDateRange = context.state.filters.paymentDate;
      const isTodayInDateRange =
        paymentDateRange.from < DateService.TOMORROW_TIMESTAMP &&
        paymentDateRange.to > DateService.TOMORROW_TIMESTAMP;

      if (isTodayInDateRange && context.state.isShownPlannedTransactions) {
        const mainTransactions = context.state.transactions.filter(
          (item) => (!item.parentId && !item.transferId) || (item.transferId && !item.isPositive)
        );

        const newTotalPlannedTransaction = mainTransactions.filter(
          (item) =>
            item.paymentDate > DateService.TOMORROW_TIMESTAMP &&
            item.paymentDate <= paymentDateRange.to
        );

        context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", {
          totalPlannedTransactions: newTotalPlannedTransaction.length,
        });
      } else if (isTodayInDateRange) {
        const newPlannedTransactions = response.data.filter(
          (item) =>
            item.paymentDate > DateService.TOMORROW_TIMESTAMP &&
            item.paymentDate <= paymentDateRange.to
        );
        const oldPlannedTransactions = context.state.totalPlannedTransactions;

        context.commit("SET_TOTAL_PLANNED_TRANSACTIONS", {
          totalPlannedTransactions: newPlannedTransactions.length + oldPlannedTransactions,
        });
      }

      context.dispatch("getTotalsBalance");
    },

    async deleteTransaction(context, id) {
      await deleteTransaction(id);

      context.commit("DELETE_TRANSACTION", id);
      context.dispatch("getTotalsBalance");
    },

    async massDeleteTransactions(context, params) {
      await massDeleteTransactions(params);

      context.commit("DELETE_TRANSACTIONS", params.ids);
      context.dispatch("getTotalsBalance");
    },
  },
};
