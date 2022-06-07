import ApiService from "@/services/api.service";

export const PERMISSIONS = {
  transactions: {
    view: "transactions.view",
    edit: "transactions.edit",
    delete: "transactions.delete",
    export: "transactions.export",
    import: "transactions.import",
  },
  reports: "reports",
  settings: "settings",
};

export async function getRole(roleId) {
  const response = await ApiService.get(`/roles/${roleId}`);

  return response.data.data;
}

export async function getRoles(withLoader) {
  const response = await ApiService.get("/roles", { withLoader });

  return response.data.data;
}

export async function addRole(role) {
  const response = await ApiService.post("/roles", role, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateRole(role) {
  const response = await ApiService.patch(`/roles/${role.id}`, role, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateRoleSort(roles) {
  await ApiService.put("/roles/sort", roles, {
    withLoader: false,
  });
}

export async function deleteRole(roleId, delaySuccessNotify) {
  await ApiService.delete(`/roles/${roleId}`, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  PERMISSIONS,
  getRole,
  getRoles,
  addRole,
  updateRole,
  updateRoleSort,
  deleteRole,
};
