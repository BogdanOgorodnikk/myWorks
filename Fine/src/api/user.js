import ApiService from "@/services/api.service";

export async function getUser(userId) {
  const response = await ApiService.get(`/users/${userId}`);

  return response.data.data;
}

export async function getUsers(withLoader) {
  const response = await ApiService.get("/users", { withLoader });

  return response.data.data;
}

export async function inviteUser(user) {
  const response = await ApiService.post("/users", user, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateUser(user) {
  const response = await ApiService.put(`/users/${user.id}`, user, {
    withNotify: false,
  });

  return response.data.data;
}

export async function getUserProfile() {
  const response = await ApiService.get("/users/current", { isMainBaseUrl: true });

  return response.data.data;
}

export async function updateUserProfile(userData) {
  const response = await ApiService.patch("/users/current", userData, {
    withNotify: true,
    isMainBaseUrl: true,
  });

  return response.data.data;
}

export default {
  getUser,
  getUsers,
  inviteUser,
  updateUser,
  getUserProfile,
  updateUserProfile,
};
