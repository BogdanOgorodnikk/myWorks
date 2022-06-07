import idb from "@/plugins/vue-idb-keyval";
import router from "@/router";
import { getRole, getRoles, addRole, updateRole, deleteRole, updateRoleSort } from "@/api/role";
import DataService from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    role: null,
    roles: [],
  },

  getters: {
    rolesForSelect(state) {
      const roles = state.roles;

      return roles.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_ROLE(state, role = null) {
      state.role = role;
    },

    SET_ROLES(state, roles) {
      if (roles.length) {
        const activeRoles = roles.filter((item) => !item.isTrashed);

        state.roles = activeRoles.sort(DataService.compareValues("sort"));
      } else if (!Array.isArray(roles)) {
        state.roles.push(roles);
      }
    },

    UPDATE_ROLE(state, role) {
      state.roles = DataService.updateArray(state.roles, [role]);
    },

    DELETE_ROLE(state, roleId) {
      state.roles = state.roles.filter((role) => role.id !== roleId);
    },
  },

  actions: {
    async getRole(context, roleId) {
      if (!roleId) return;

      const response = await getRole(roleId);

      context.commit("SET_ROLE", response);
    },

    async getRoles(context) {
      if (context.state.roles.length) return;

      const idbRoles = await idb.get("roles");
      const isPresentIdbData = !!idbRoles?.length;

      if (isPresentIdbData) {
        context.commit("SET_ROLES", idbRoles);
      }

      const response = await getRoles(!isPresentIdbData);

      context.commit("SET_ROLES", response);

      await idb.set("roles", response);
    },

    async addRole(context, role) {
      const response = await addRole(role);

      context.commit("SET_ROLES", response);

      await idb.set("roles", context.state.roles);

      await router.push({ name: "RoleList" });
    },

    async updateRole(context, role) {
      const response = await updateRole(role);

      context.commit("UPDATE_ROLE", response);

      await idb.set("roles", context.state.roles);

      await router.push({ name: "RoleList" });
    },

    async updateRoleSort(context, roles) {
      await updateRoleSort(roles);
    },

    async deleteRole(context, { roleId, currentRoute, delaySuccessNotify = false }) {
      await deleteRole(roleId, delaySuccessNotify);

      context.commit("DELETE_ROLE", roleId);

      await idb.set("roles", context.state.roles);

      if (currentRoute !== "RoleList") {
        await router.push({ name: "RoleList" });
      }
    },
  },
};
