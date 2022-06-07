import ApiService from "@/services/api.service";

export async function getPublicBuildings(text) {
  const response = await ApiService.get(
    `/public/customer-management/building/search/findByText?value=${text}`
  );

  return response.data.content;
}

export async function getBuildingImage(imageName) {
  const response = await ApiService.get(`/storage/img/url/${imageName}`);

  return response.data.value;
}

export default {
  getPublicBuildings,
  getBuildingImage,
};
