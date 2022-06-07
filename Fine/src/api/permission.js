import ApiService from "@/services/api.service";

export async function getPermissions() {
  const response = await ApiService.get("/permissions");

  return response.data.data;
}

export default {
  getPermissions,
};
