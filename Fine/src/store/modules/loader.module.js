export default {
  namespaced: true,

  state: {
    isRenderingPage: true,
    isLoading: false,
    requestsTimeout: "",
    requestsQuare: [],
    componentRequestsQuare: [],
  },

  mutations: {
    SET_COMPONENT_REQUESTS_QUARE(state, requests) {
      state.componentRequestsQuare = [...state.componentRequestsQuare, ...requests];
    },

    DELETE_COMPONENT_REQUESTS_QUARE(state) {
      state.componentRequestsQuare = [];
    },

    SET_RENDERING_FINISHED(state) {
      state.isRenderingPage = false;
    },

    SET_LOADING_ON: (state, apiEndpoint) => {
      state.requestsQuare.push(apiEndpoint);
      state.isLoading = true;

      clearTimeout(state.requestsTimeout);
    },

    SET_LOADING_OFF: (state, apiEndpoint) => {
      state.requestsQuare.forEach((item, index) => {
        if (item === apiEndpoint) {
          state.requestsQuare.splice(index, 1);
        }
      });

      state.requestsTimeout = setTimeout(() => {
        if (!state.requestsQuare.length) {
          state.isLoading = false;
        }
      }, 150);
    },
  },
};
