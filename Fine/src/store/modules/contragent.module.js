import idb from "@/plugins/vue-idb-keyval";
import router from "@/router";
import {
  getContragent,
  getContragents,
  addContragent,
  updateContragent,
  deleteContragent,
} from "@/api/contragent";
import DataService from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    contragent: null,
    contragents: [],
    filters: {},
  },

  getters: {
    contragentsForSelect(state) {
      const contragents = state.contragents;

      return contragents.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_CONTRAGENT(state, contragent = null) {
      state.contragent = contragent;
    },

    SET_CONTRAGENTS(state, contragents) {
      if (contragents.length) {
        state.contragents = contragents;
      } else {
        state.contragents.push(contragents);
      }
    },

    SET_FILTERS(state, filters) {
      state.filters = filters;
    },

    UPDATE_CONTRAGENT(state, contragent) {
      state.contragents = DataService.updateArray(state.contragents, [contragent]);
    },

    DELETE_CONTRAGENT(state, contragentId) {
      state.contragents = state.contragents.filter((contragent) => contragent.id !== contragentId);
    },
  },

  actions: {
    async getContragent(context, contragentId) {
      if (!contragentId) return;

      const response = await getContragent(contragentId);

      context.commit("SET_CONTRAGENT", response);
    },

    async getContragents(context) {
      if (context.state.contragents.length) return;

      const idbContragents = await idb.get("contragents");
      const isPresentIdbData = !!idbContragents?.length;

      if (isPresentIdbData) {
        context.commit("SET_CONTRAGENTS", idbContragents);
      }

      const response = await getContragents(!isPresentIdbData);

      context.commit("SET_CONTRAGENTS", response);

      await idb.set("contragents", response);
    },

    async addContragent(context, contragent) {
      const response = await addContragent(contragent);

      context.commit("SET_CONTRAGENTS", response);

      await idb.set("contragents", context.state.contragents);

      await router.push({ name: "ContragentList" });
    },

    async updateContragent(context, contragent) {
      const response = await updateContragent(contragent);

      context.commit("UPDATE_CONTRAGENT", response);

      await idb.set("contragents", context.state.contragents);

      await router.push({ name: "ContragentList" });
    },

    async deleteContragent(context, { contragentId, currentRoute, delaySuccessNotify = false }) {
      await deleteContragent(contragentId, delaySuccessNotify);

      context.commit("DELETE_CONTRAGENT", contragentId);

      await idb.set("contragents", context.state.contragents);

      if (currentRoute !== "ContragentList") {
        await router.push({ name: "ContragentList" });
      }
    },
  },
};
