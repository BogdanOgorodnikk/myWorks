<template>
  <tbody :class="theme">
    <tr>
      <td :colspan="colspan">
        <span class="empty-table-msg" data-cy="empty-table-msg">
          {{ emptyTableMsg }}
        </span>
      </td>
    </tr>
  </tbody>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";

export default {
  name: "OurEmptyTableMsg",

  props: {
    colspan: {
      type: Number,
      default: 1,
    },

    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    emptyTableMsg() {
      const isFiltersApplied = !!Object.keys(this.filters).length;

      return isFiltersApplied ? this.i18n.noResultsForFilters : this.i18n.noItems;
    },

    i18n() {
      return {
        noItems: this.$te("component.table.noItems")
          ? this.$t("component.table.noItems")
          : this.$t("noItems"),
        noResultsForFilters: this.$te("component.table.noResultsForFilters")
          ? this.$t("component.table.noResultsForFilters")
          : this.$t("noResultsForFilters"),
      };
    },

    theme() {
      return getTheme();
    },
  },
};
</script>

<i18n>
en:
  noItems: There is no data in the table yet.
  noResultsForFilters: No results were found for the specified filters.
ru:
  noItems: Пока что в таблице нет данных.
  noResultsForFilters: По заданным фильтрам ничего не найдено.
ua:
  noItems: Поки що в таблиці немає даних.
  noResultsForFilters: За заданим фільтрам нічого не знайдено.
</i18n>

<style lang="postcss" scoped>
.empty-table-msg {
  @apply flex w-full justify-center font-extralight text-gray-400;
}
</style>
