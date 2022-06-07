import ApiService from "@/services/api.service";
import QS from "qs";

export async function getCurrenciesList(isMainBaseUrl) {
  const response = await ApiService.get(`/currencies`, { isMainBaseUrl: isMainBaseUrl });

  return response.data.data;
}

export async function getCurrencyRate(params) {
  const querySettings = {
    arrayFormat: "brackets",
    encode: false,
  };

  const preparedQueryString = QS.stringify(params, querySettings);
  const response = await ApiService.get(`/currencies/rate?${preparedQueryString}`);

  return response.data.data;
}

export default {
  getCurrenciesList,
  getCurrencyRate,
};
