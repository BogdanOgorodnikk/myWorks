import i18n from "@/plugins/vue-i18n";
import { getCurrenciesList, getCurrencyRate } from "@/api/currency";
import { fromUnixTime, getDate, getMonth, getYear } from "date-fns";

export default {
  namespaced: true,
  state: {
    currencies: [],
    currencyRates: [],
  },

  getters: {
    currencies(state, getters) {
      const currencyValues = state.currencies;

      let currencyOptions = [];

      if (currencyValues) {
        currencyOptions = currencyValues.map((currency) => ({
          id: currency.id,
          code: currency.code,
          symbol: currency.symbol,
          label: getters.currencyLabel(currency),
        }));
      }

      return currencyOptions;
    },

    currencyLabel() {
      return (currency) => {
        return `${currency.code}, ${currency.symbol} – ${i18n.t(`currencies.${currency.code}`)}`;
      };
    },

    currencyRate(state) {
      return (currency) => {
        const date = fromUnixTime(currency.timestamp);
        const preparedDate = `${getDate(date)}-${getMonth(date)}-${getYear(date)}`;

        const dateBlockWithCurrency = state.currencyRates.find(
          (item) => item.date === preparedDate
        );

        const findingCurrency = dateBlockWithCurrency.currencies.find(
          (item) => item.id === String(currency.id)
        );

        return findingCurrency?.rate;
      };
    },
  },

  mutations: {
    SET_CURRENCIES(state, currencies) {
      state.currencies = currencies;
    },

    SET_CURRENCY_RATES(state, newCurrencyRates) {
      let currencyRates = state.currencyRates;
      const currencyRateDateIndex = currencyRates.findIndex(
        (item) => item.date === newCurrencyRates.date
      );

      if (~currencyRateDateIndex) {
        newCurrencyRates.currencies.forEach((item) => {
          currencyRates[currencyRateDateIndex].currencies.push(item);
        });
      } else {
        currencyRates.push(newCurrencyRates);
      }

      state.currencyRates = currencyRates;
    },
  },

  actions: {
    async getCurrencies(context, isMainBaseUrl = false) {
      if (context.state.currencies.length) return;

      const response = await getCurrenciesList(isMainBaseUrl);

      context.commit("SET_CURRENCIES", response);
    },

    /*
      Return data with currency rate for some date
      @param {Object} params
      @param {Timestamp} params.timestamp - Timestamp for finding if this date using in store or create new
      @param {Array} params.currencyIds - Ids with currency wich will be get
     */

    async getCurrencyRate(context, params) {
      const currencyRates = context.state.currencyRates;
      const date = fromUnixTime(params.timestamp);
      const preparedDate = `${getDate(date)}-${getMonth(date)}-${getYear(date)}`;
      const currencyRateDate = currencyRates.find((item) => item.date === preparedDate);

      if (currencyRateDate) {
        let newCurrencies = [];

        params.currencyIds.forEach((newCurrency) => {
          const isUsingCurrency = currencyRateDate.currencies.find(
            (usedCurrency) => usedCurrency.id === String(newCurrency)
          );

          if (!isUsingCurrency) {
            newCurrencies.push(newCurrency);
          }
        });

        if (newCurrencies.length) {
          const preparedParams = {
            currencyIds: newCurrencies,
            timestamp: params.timestamp,
          };

          const preparedData = await currencyRateRequest(preparedParams, preparedDate);

          return context.commit("SET_CURRENCY_RATES", preparedData);
        }
      } else {
        const preparedData = await currencyRateRequest(params, preparedDate);

        return context.commit("SET_CURRENCY_RATES", preparedData);
      }
    },
  },
};

async function currencyRateRequest(params, preparedDate) {
  let preparedData = {
    id: params.currencyIds,
    date: params.currencyIds.map(() => params.timestamp),
  };

  const response = await getCurrencyRate(preparedData);

  let storeData = {
    date: preparedDate,
    currencies: [],
  };

  for (const key in response) {
    storeData.currencies.push({
      id: key,
      rate: response[key],
    });
  }

  return storeData;
}
