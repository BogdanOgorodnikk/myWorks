import ApiService from "@/services/api.service";

export async function getBx24Companies() {
  const response = await ApiService.get(`/crm/companies`);

  return response.data.data;
}

export default {
  getBx24Companies,
};
