import { getUnixTime } from "date-fns";
import store from "@/store";

export async function prepareMoneyForTransfer(form) {
  const initialCurrencySymbol = form.money?.initialCurrency.symbol;
  const convertibleCurrencySymbol = form.money?.convertibleCurrency.symbol;

  let money = {
    to: {
      rate: "",
      sum: "",
    },
    from: {
      rate: "",
      sum: "",
    },
  };

  if (initialCurrencySymbol === convertibleCurrencySymbol) {
    money = {
      to: {
        rate: form.money?.firstRate.placeholder,
        sum: form.money?.initialCurrency.sum,
      },
      from: {
        rate: form.money?.firstRate.placeholder,
        sum: form.money?.initialCurrency.sum,
      },
    };
  } else if (!form.money?.secondRate) {
    const baseCurrency = store.getters["settings/baseCurrency"];
    const currencyRate = store.getters["currency/currencyRate"];

    const params = {
      currencyIds: [baseCurrency.currentId],
      timestamp: getUnixTime(new Date()),
    };

    await store.dispatch("currency/getCurrencyRate", params);

    const baseCurrencyRate = currencyRate({
      timestamp: params.timestamp,
      id: baseCurrency.currentId,
    });

    if (initialCurrencySymbol === form.money?.firstRate.symbol) {
      money = {
        to: {
          rate: form.money?.firstRate.sum || form.money?.firstRate.placeholder,
          sum: form.money?.initialCurrency.sum,
        },
        from: {
          rate: baseCurrencyRate,
          sum: form.money?.convertibleCurrency.sum,
        },
      };
    } else {
      money = {
        to: {
          rate: baseCurrencyRate,
          sum: form.money?.initialCurrency.sum,
        },
        from: {
          rate: form.money?.firstRate.sum || form.money?.firstRate.placeholder,
          sum: form.money?.convertibleCurrency.sum,
        },
      };
    }
  } else {
    money = {
      to: {
        rate: form.money?.secondRate.sum || form.money?.secondRate.placeholder,
        sum: form.money?.initialCurrency.sum,
      },
      from: {
        rate: form.money?.firstRate.sum || form.money?.firstRate.placeholder,
        sum: form.money?.convertibleCurrency.sum,
      },
    };
  }

  return money;
}

export default {
  prepareMoneyForTransfer,
};
