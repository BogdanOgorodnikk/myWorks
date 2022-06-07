import ApiService from "@/services/api.service";

export const BANK_CODES = {
  privatBusiness: "privat24Business",
  privatPersonal: "privat24Personal",
  monobankPersonal: "monobankPersonal",
  other: "other",
};

export async function addAccount(account) {
  const response = await ApiService.post("/accounts", account, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function getAccounts(withLoader) {
  const response = await ApiService.get("/accounts", { withLoader });

  return response.data.data;
}

export async function getAccount(accountId) {
  const response = await ApiService.get(`/accounts/${accountId}`);

  return response.data.data;
}

export async function getMonobankAccounts(token) {
  const response = await ApiService.get(
    `/transactions/import/integrations/monobank/accounts?token=${token}`
  );

  return response.data.data;
}

export async function addIntegrationWithMonobank(account) {
  return await ApiService.post("/transactions/import/integrations/monobank", account, true);
}

export async function getIntegrationAccounts() {
  const response = await ApiService.get("/transactions/import/integrations");

  return response.data.data;
}

export async function updateIntegrationAccount(integrationId) {
  await ApiService.get(`/transactions/import/integrations/${integrationId}/start`);
}

export async function stopIntegrationAccount(integrationId) {
  await ApiService.get(`/transactions/import/integrations/${integrationId}/stop`);
}

export async function getIntegrationAccount(integrationId) {
  const response = await ApiService.get(`/transactions/import/integrations/${integrationId}`);

  return response.data.data;
}

export async function updateAccount(account) {
  const response = await ApiService.put(`/accounts/${account.id}`, account, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateAccountSort(accounts) {
  await ApiService.patch("/accounts/sort", accounts, {
    withLoader: false,
  });
}

export async function deleteAccount(accountId, delaySuccessNotify) {
  await ApiService.delete(`/accounts/${accountId}`, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  addAccount,
  getAccount,
  getAccounts,
  getMonobankAccounts,
  addIntegrationWithMonobank,
  updateIntegrationAccount,
  stopIntegrationAccount,
  getIntegrationAccounts,
  getIntegrationAccount,
  updateAccount,
  updateAccountSort,
  deleteAccount,
  BANK_CODES,
};
