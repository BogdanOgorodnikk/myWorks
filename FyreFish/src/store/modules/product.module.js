import { getPublicProducts } from "@/api/product";

export default {
  namespaced: true,
  state: {
    products: [],
  },

  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
  },

  actions: {
    async getPublicProducts(context, buildId) {
      const response = await getPublicProducts(buildId);

      context.commit("SET_PRODUCTS", response);
    },
  },
};
