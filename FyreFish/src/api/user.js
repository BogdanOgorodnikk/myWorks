import ApiService from "@/services/api.service";

export const ROLES = {
  manager: "property_manager",
};

export async function getCustomers() {
  const response = await ApiService.get(`/customer-management/customers/`);

  return response.data;
}

export async function getAccountById(id) {
  const response = await ApiService.get(`/customer-management/account/${id}`);

  return response.data;
}

export async function getAccountsByClientId(id) {
  const response = await ApiService.get(`/customer-management/customer/${id}/accounts`);

  return response.data;
}

export async function getUsersByAccountId(id) {
  const response = await ApiService.get(`/customer-management/account/${id}/users`);

  return response.data;
}

export async function getUserProfile() {
  const response = await ApiService.get("/auth/user/profile");

  return response.data;
}

export async function updateUserProfile(userData) {
  const response = await ApiService.patch("/users/profile", userData, {
    withNotify: true,
  });

  return response.data.data;
}

export async function getUserType() {
  const response = await ApiService.get("/auth/userinfo");

  return response.data.portalRole;
}

export async function getContactRoles() {
  const response = await ApiService.get("/customer-management/contactRoles", null);

  return response.data;
}

export async function postContact(data) {
  const response = await ApiService.post("/customer-management/contact", data);

  return response.data;
}

export default {
  ROLES,
  getAccountById,
  getUserProfile,
  updateUserProfile,
  getUserType,
  getUsersByAccountId,
  getContactRoles,
  postContact,
};
