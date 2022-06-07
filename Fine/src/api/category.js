import ApiService from "@/services/api.service";

export const CATEGORY_ACTIVITIES = {
  income: "income",
  expense: "expense",
  transfer: "transfer",
  deposit: "deposit",
  withdrawal: "withdrawal",
};

export const DEFAULT_CATEGORY_CODE = {
  income: "undistributedIncomings",
  expense: "undistributedExpenses",
  transfer: "transferBwAccounts",
};

export const ACTIVITY_TYPES = {
  operating: "operating",
  financial: "financial",
  investment: "investment",
};

export async function getCategory(categoryId) {
  if (!categoryId) return;

  const response = await ApiService.get(`/categories/${categoryId}`);

  return response.data.data;
}

export async function getCategories(withLoader) {
  const response = await ApiService.get("/categories", { withLoader });

  return response.data.data;
}

export async function getCategoryTypes() {
  const response = await ApiService.get("/categories/types");

  return response.data.data;
}

export async function getCategoryActivities() {
  const response = await ApiService.get("/categories/activities");

  return response.data.data;
}

export async function addCategory(category) {
  const response = await ApiService.post("/categories", category, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateCategory(category) {
  const response = await ApiService.put(`/categories/${category.id}`, category, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateCategorySort(categories) {
  await ApiService.put(`/categories/sort`, categories, {
    withLoader: false,
  });
}

export async function deleteCategory(categoryId, delaySuccessNotify) {
  await ApiService.delete(`/categories/${categoryId}`, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  CATEGORY_ACTIVITIES,
  ACTIVITY_TYPES,
  DEFAULT_CATEGORY_CODE,
  getCategory,
  getCategories,
  getCategoryTypes,
  getCategoryActivities,
  addCategory,
  updateCategory,
  updateCategorySort,
  deleteCategory,
};
