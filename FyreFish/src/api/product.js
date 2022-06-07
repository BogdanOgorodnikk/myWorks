import ApiService from "@/services/api.service";

export async function getPublicProducts(buildId) {
  const response = await ApiService.get(
    `/public/product-catalog/product/search/findByPlace?placeId=${buildId}`
  );

  return response.data.content;
}

export default {
  getPublicProducts,
};
