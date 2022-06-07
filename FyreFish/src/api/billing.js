import ApiService from "@/services/api.service";

export async function addPaymentMethod(accountId, paymentData) {
  const response = await ApiService.post(
    `/billing/accounts/${accountId}/paymentMethods`,
    paymentData,
    { withNotify: true }
  );

  return response.data;
}

export default {
  addPaymentMethod,
};
