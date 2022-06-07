import ApiService from "@/services/api.service";

const NOT_VALID_APP_CODE = "appNotValid";

async function login(userData) {
  const response = await ApiService.post("/login", userData, { isMainBaseUrl: true });

  return response.data.data;
}

async function loginToApp(businessId) {
  const response = await ApiService.post(
    "/login/business",
    { businessId },
    { isMainBaseUrl: true }
  );

  return response.data.data;
}

async function signUp(userData) {
  await ApiService.post("/users/signup", userData, {
    withNotify: true,
    isMainBaseUrl: true,
  });
}

async function refreshAuth() {
  const response = await ApiService.post("/refresh", null, { isMainBaseUrl: true });

  return response.data.data;
}

async function resetPassword(userData) {
  return ApiService.patch("/users/password/reset", userData, {
    withNotify: true,
    isMainBaseUrl: true,
  });
}

async function changeUserPassword(userData) {
  const response = await ApiService.patch("/users/password/change", userData, {
    withNotify: true,
    isMainBaseUrl: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

async function logout() {
  await ApiService.post("/logout", null, { isMainBaseUrl: true });
}

export {
  NOT_VALID_APP_CODE,
  login,
  loginToApp,
  signUp,
  refreshAuth,
  resetPassword,
  changeUserPassword,
  logout,
};
