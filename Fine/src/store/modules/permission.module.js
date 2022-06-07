import i18n from "@/plugins/vue-i18n";
import { getPermissions } from "@/api/permission";

export default {
  namespaced: true,
  state: {
    permissions: [],
  },

  getters: {
    permissions(state) {
      return state.permissions.map((permission) => ({
        label: i18n.t(`label.permission.names.${permission.name}`),
        ...permission,
      }));
    },
  },

  mutations: {
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions;
    },
  },

  actions: {
    async getPermissions(context) {
      const response = await getPermissions();

      context.commit("SET_PERMISSIONS", response);
    },
  },
};
