import ApiService from "@/services/api.service";

export async function getSettings() {
  const response = await ApiService.get("/config/get");

  return response.data.data;
}

export async function getServerIP() {
  const response = await ApiService.get("/config/server-ip");

  return response.data.data;
}

export async function updateSettings(params) {
  const response = await ApiService.post("/config/set", params, {
    withNotify: true,
  });

  return response.data.data;
}

export default {
  getSettings,
  getServerIP,
  updateSettings,
};
