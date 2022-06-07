import idb from "@/plugins/vue-idb-keyval";
import router from "@/router";
import { getTag, getTags, addTag, updateTag, deleteTag, updateTagSort } from "@/api/tag";
import DataService from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    tag: null,
    tags: [],
  },

  getters: {
    tagsForSelect(state) {
      const tags = state.tags;

      return tags.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_TAG(state, tag = null) {
      state.tag = tag;
    },

    SET_TAGS(state, tags) {
      if (tags.length) {
        state.tags = tags.sort(DataService.compareValues("sort"));
      } else if (!Array.isArray(tags)) {
        state.tags.push(tags);
      }
    },

    UPDATE_TAG(state, tag) {
      state.tags = DataService.updateArray(state.tags, [tag]);
    },

    DELETE_TAG(state, tagId) {
      state.tags = state.tags.filter((tag) => tag.id !== tagId);
    },
  },

  actions: {
    async getTag(context, tagId) {
      if (!tagId) return;

      const response = await getTag(tagId);

      context.commit("SET_TAG", response);
    },

    async getTags(context) {
      if (context.state.tags.length) return;

      const idbTags = await idb.get("tags");
      const isPresentIdbData = !!idbTags?.length;

      if (isPresentIdbData) {
        context.commit("SET_TAGS", idbTags);
      }

      const response = await getTags(!isPresentIdbData);

      context.commit("SET_TAGS", response);

      await idb.set("tags", response);
    },

    async addTag(context, tag) {
      const response = await addTag(tag);

      context.commit("SET_TAGS", response);

      await idb.set("tags", context.state.tags);

      await router.push({ name: "TagList" });
    },

    async updateTag(context, tag) {
      const response = await updateTag(tag);

      context.commit("UPDATE_TAG", response);

      await idb.set("tags", context.state.tags);

      await router.push({ name: "TagList" });
    },

    async updateTagSort(context, tags) {
      await updateTagSort(tags);
    },

    async deleteTag(context, { tagId, currentRoute, delaySuccessNotify = false }) {
      await deleteTag(tagId, delaySuccessNotify);

      context.commit("DELETE_TAG", tagId);

      await idb.set("tags", context.state.tags);

      if (currentRoute !== "TagList") {
        await router.push({ name: "TagList" });
      }
    },
  },
};
