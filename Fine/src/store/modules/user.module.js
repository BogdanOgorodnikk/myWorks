import idb from "@/plugins/vue-idb-keyval";
import router from "@/router";
import {
  getUser,
  getUserProfile,
  getUsers,
  inviteUser,
  updateUser,
  updateUserProfile,
} from "@/api/user";
import DataService from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    user: null,
    users: [],
    userProfile: null,
    languages: [
      {
        code: "ua",
        label: "Українська",
        slug: "Укр",
      },
      {
        code: "ru",
        label: "Русский",
        slug: "Рус",
      },
      {
        code: "en",
        label: "English",
        slug: "Eng",
      },
    ],
  },

  getters: {
    userProfile(state) {
      return state.userProfile;
    },

    userProfileName(state) {
      const name = state.userProfile?.firstName || "";
      const surname = state.userProfile?.lastName || "";

      return `${name} ${surname}`;
    },

    userProfileEmail(state) {
      return state.userProfile?.email;
    },

    userProfileAvatar(state) {
      return state.userProfile?.avatar;
    },

    userProfileNameFirstLetters(state) {
      const firstLetterInName = state.userProfile?.firstName
        ? state.userProfile.firstName[0].toUpperCase()
        : "";
      const firstLetterInSurname = state.userProfile?.lastName
        ? state.userProfile.lastName[0].toUpperCase()
        : "";

      return `${firstLetterInName}${firstLetterInSurname}`;
    },

    languages(state) {
      return state.languages;
    },

    bgImagePath(state) {
      const imageName = state.userProfile?.imageName || "default.jpg";

      return require(`@/assets/images/backgrounds/${imageName}`);
    },
  },

  mutations: {
    SET_USER(state, user = null) {
      state.user = user;
    },

    SET_USERS(state, users) {
      if (users.length) {
        state.users = users;
      } else {
        state.users.push(users);
      }
    },

    UPDATE_USER(state, user) {
      state.users = DataService.updateArray(state.users, [user]);
    },

    SET_USER_PROFILE(state, userProfile) {
      state.userProfile = userProfile;
    },
  },

  actions: {
    async getUserProfile(context) {
      if (context.state.userProfile) return;

      const idbUserProfile = await idb.get("userProfile");
      const isPresentIdbData = !!idbUserProfile?.length;

      if (isPresentIdbData) {
        context.commit("SET_USER_PROFILE", idbUserProfile);
      }

      const response = await getUserProfile();

      context.commit("SET_USER_PROFILE", response);

      await idb.set("userProfile", response);
    },

    async updateUserProfile(context, profileData) {
      const response = await updateUserProfile(profileData);

      context.commit("SET_USER_PROFILE", response);

      await idb.set("userProfile", response);
    },

    async getUser(context, userId) {
      if (!userId) return;

      const response = await getUser(userId);

      context.commit("SET_USER", response);
    },

    async getUsers(context) {
      if (context.state.users.length) return;

      const idbUsers = await idb.get("users");
      const isPresentIdbData = !!idbUsers?.length;

      if (isPresentIdbData) {
        context.commit("SET_USERS", idbUsers);
      }

      const response = await getUsers(!isPresentIdbData);

      context.commit("SET_USERS", response);

      await idb.set("users", response);
    },

    async inviteUser(context, user) {
      const response = await inviteUser(user);

      context.commit("SET_USERS", response);

      await idb.set("users", context.state.users);

      await router.push({ name: "UserList" });
    },

    async updateUser(context, user) {
      const response = await updateUser(user);

      context.commit("UPDATE_USER", response);

      await idb.set("users", context.state.users);

      await router.push({ name: "UserList" });
    },
  },
};
