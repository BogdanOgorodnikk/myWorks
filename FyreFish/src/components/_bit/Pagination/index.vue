<template>
  <div class="pagination-wrap" :class="theme">
    <t-pagination v-model="currentPageModel" :per-page="perPage" :total-items="total" />
  </div>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";

export default {
  name: "OurPagination",

  props: {
    currentPage: {
      type: Number,
      default: 1,
    },

    perPage: {
      type: Number,
      default: 20,
    },

    total: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    currentPageModel: {
      get() {
        return this.currentPage;
      },
      set(page) {
        this.$emit("pageChange", page);
      },
    },

    theme() {
      return getTheme();
    },
  },
};
</script>

<style lang="postcss" scoped>
.pagination-wrap {
  @apply mt-4 flex justify-center;
}
</style>
