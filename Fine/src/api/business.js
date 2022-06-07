import ApiService from "@/services/api.service";

export async function getBusiness(businessId) {
  const response = await ApiService.get(`/businesses/${businessId}`, { isMainBaseUrl: true });

  return response.data.data;
}

export async function getBusinesses(withLoader = true) {
  const response = await ApiService.get("/businesses", { isMainBaseUrl: true, withLoader });

  return response.data.data;
}

export async function createBusiness(business) {
  const response = await ApiService.post("/businesses", business, {
    withNotify: true,
    isMainBaseUrl: true,
  });

  return response.data.data;
}

export async function updateBusiness(business, withNotify) {
  const response = await ApiService.patch(`/businesses/${business.id}`, business, {
    withNotify,
    isMainBaseUrl: true,
  });

  return response.data.data;
}

export async function deleteBusiness(businessId) {
  await ApiService.delete(`/businesses/${businessId}`, {
    withNotify: true,
    isMainBaseUrl: true,
  });
}

export default {
  getBusiness,
  getBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
};
