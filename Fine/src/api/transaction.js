import ApiService from "@/services/api.service";
import NotifyService from "@/services/notify.service";
import i18n from "@/plugins/vue-i18n";
import QS from "qs";

export const TRANSACTIONS_RESOURCE = "/transactions";

export const TRANSACTION_TYPE = {
  expense: "expense",
  income: "income",
  transfer: "transfer",
};

export const TRANSACTION_QS_OPTIONS = {
  arrayFormat: "brackets",
  encode: false,
};

export const MONEY_FUTURE_PAYMENTS_PERIOD = {
  one: "oneMoth",
  three: "threeMonths",
  six: "sixMonths",
  twelve: "twelveMonths",
};

export const TRANSACTIONS_PER_PAGE = 100;

export const IMPORT_FIELDS = {
  sum: {
    name: "sum",
    isRequired: true,
  },
  paidIn: {
    name: "paidIn",
    isRequired: true,
  },
  paidOut: {
    name: "paidOut",
    isRequired: true,
  },
  paymentDate: {
    name: "paymentDate",
    isRequired: true,
  },
  description: {
    name: "description",
    isRequired: true,
  },
  skip: {
    name: "skip",
    isRequired: false,
  },
  category: {
    name: "category",
    isRequired: false,
  },
  accrualDate: {
    name: "accrualDate",
    isRequired: false,
  },
  accrualConfirmed: {
    name: "accrualConfirmed",
    isRequired: false,
  },
  paymentConfirmed: {
    name: "paymentConfirmed",
    isRequired: false,
  },
  operationType: {
    name: "operationType",
    isRequired: false,
  },
  rate: {
    name: "rate",
    isRequired: false,
  },
};

export async function getTransactions(params) {
  if (params.pagination) {
    params.pagination.perPage = TRANSACTIONS_PER_PAGE;
  } else {
    params.pagination = {
      perPage: TRANSACTIONS_PER_PAGE,
    };
  }

  const paramsQueryString = QS.stringify(params, TRANSACTION_QS_OPTIONS);
  const response = await ApiService.get(`${TRANSACTIONS_RESOURCE}?${paramsQueryString}`);

  return response.data.data;
}

export async function getExchangeRate(date, currencyCode) {
  const response = await ApiService.get(
    `/transactions/rate?currency_code=${currencyCode}&date=${date}`
  );

  return response.data.data;
}

export async function getTransaction(itemId) {
  const response = await ApiService.get(`/transactions/${itemId}`);

  return response.data.data;
}

export async function getCalendarTransactions(params) {
  const paramsQueryString = QS.stringify(params, TRANSACTION_QS_OPTIONS);

  const response = await ApiService.get(`/transactions/totals/calendar?${paramsQueryString}`);

  return response.data.data;
}

export async function getTotalsTransactions(params) {
  const paramsQueryString = QS.stringify(params, TRANSACTION_QS_OPTIONS);

  const response = await ApiService.get(`/transactions/totals?${paramsQueryString}`, {
    withLoader: false,
  });

  return response.data.data;
}

export async function getTotalsBalance() {
  const response = await ApiService.get(`/transactions/totals/balances`, {
    withLoader: false,
  });

  return response.data.data;
}

export async function getTransactionsImportTemplate(params) {
  const response = await ApiService.get(
    `/transactions/import/file/template?bankAccountId=${params}`
  );

  return response.data.data;
}

export async function exportTransactions(ids) {
  const paramsWithColumns = {
    filters: {
      id: ids,
    },
    columns: {
      paymentDate: i18n.t("label.paymentDate"),
      sum: i18n.t("label.sum"),
      currency: i18n.t("label.currency"),
      rate: i18n.t("label.rate"),
      bankAccount: i18n.t("label.account"),
      company: i18n.t("label.company"),
      description: i18n.t("label.description"),
      category: i18n.t("label.category"),
      accrualDate: i18n.t("label.accrualDate"),
      accrualConfirmed: i18n.t("label.accrualConfirmed"),
      paymentConfirmed: i18n.t("label.paymentConfirmed"),
      createdAt: i18n.t("label.createdAt"),
      updatedAt: i18n.t("label.updatedAt"),
      id: i18n.t("label.id"),
    },
  };

  const paramsQueryString = QS.stringify(paramsWithColumns, TRANSACTION_QS_OPTIONS);

  const response = await ApiService.get(`/transactions/export?${paramsQueryString}`, {
    withNotify: true,
    withLoader: false,
  });

  return response.data.data;
}

export async function addTransaction(transaction) {
  const response = await ApiService.post("/transactions", transaction, true);

  return response.data.data;
}

export async function addTransfer(transaction) {
  const response = await ApiService.post("/transactions/transfer", transaction, true);

  return response.data.data;
}

export async function mergeTransactionIntoTransfer(transactionsId) {
  const response = await ApiService.patch("/transactions/transfer", transactionsId, {
    withLoader: true,
    withNotify: true,
  });

  return response.data.data;
}

export async function divideTransferTransaction(transactionId) {
  const response = await ApiService.delete(`/transactions/transfer/${transactionId}`, {
    withLoader: true,
    withNotify: true,
  });

  return response.data.data;
}

export async function importTransactionFile(transaction) {
  await ApiService.post("/transactions/import/file", transaction, {
    withNotify: true,
  });
}

export async function updateTransaction(transaction) {
  const response = await ApiService.put(`/transactions/${transaction.id}`, transaction, true);

  return response.data.data;
}

export async function updateTransfer(transaction) {
  const response = await ApiService.put(
    `/transactions/transfer/${transaction.id}`,
    transaction,
    true
  );

  return response.data.data;
}

export async function massUpdateTransactions(transactions) {
  const response = await ApiService.patch("/transactions", transactions, true);

  return response.data.data;
}

export async function deleteTransaction(id) {
  await ApiService.delete(`/transactions/${id}`, {
    withNotify: true,
  });
}

export async function massDeleteTransactions(params) {
  const paramsQueryString = QS.stringify(params, TRANSACTION_QS_OPTIONS);

  await ApiService.delete(`/transactions?${paramsQueryString}`);

  const message = i18n.tc("component.notify.success.transactionsDeleted", params.ids.length);

  NotifyService.success(message);
}

export default {
  TRANSACTIONS_RESOURCE,
  TRANSACTION_TYPE,
  TRANSACTION_QS_OPTIONS,
  MONEY_FUTURE_PAYMENTS_PERIOD,
  IMPORT_FIELDS,
  TRANSACTIONS_PER_PAGE,
  getTransactions,
  getExchangeRate,
  getTransaction,
  getCalendarTransactions,
  getTotalsTransactions,
  getTotalsBalance,
  getTransactionsImportTemplate,
  exportTransactions,
  addTransaction,
  addTransfer,
  mergeTransactionIntoTransfer,
  divideTransferTransaction,
  updateTransaction,
  updateTransfer,
  massUpdateTransactions,
  deleteTransaction,
  massDeleteTransactions,
};
