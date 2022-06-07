import ApiService from "@/services/api.service";

export async function getIntegration(integrationId) {
  const response = await ApiService.get(`/integrations/${integrationId}`);

  return response.data.data;
}

export async function getIntegrations() {
  const response = await ApiService.get("/integrations");

  return response.data.data;
}

export async function addIntegration(integration) {
  await ApiService.post(`/integrations`, integration, true);
}

export async function updateIntegration(integration) {
  await ApiService.put(`/integrations/${integration.id}`, integration, true);
}

export async function deleteIntegration(integrationId) {
  await ApiService.delete(`/integrations/${integrationId}`);
}

export default {
  getIntegration,
  getIntegrations,
  addIntegration,
  updateIntegration,
  deleteIntegration,
};
