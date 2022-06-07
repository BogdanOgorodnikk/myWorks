import { getPublicBuildings } from "@/api/building";

export default {
  namespaced: true,
  state: {
    buildings: [],
  },

  mutations: {
    SET_BUILDINGS(state, buildings) {
      state.buildings = buildings;
    },
  },

  actions: {
    async getPublicBuildings(context, text) {
      const response = await getPublicBuildings(text);

      context.commit("SET_BUILDINGS", response);
    },
  },
};
