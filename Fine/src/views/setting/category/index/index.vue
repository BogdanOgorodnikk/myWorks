<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.category.list')"
    width="md"
    data-cy="categories-page"
  >
    <OurCard class="card" data-cy="income-card">
      <div class="card-header">
        <h3 class="card-header-title">
          {{ $t("label.cashFlowTypes.income") }}
        </h3>

        <OurButton
          v-if="isMobileDevice"
          data-cy="add-categories-button"
          size="sm"
          @click="onClickAddCategory(mainCategories.income)"
        >
          <template #icon-left>
            <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
          </template>
        </OurButton>

        <OurButton
          v-else
          size="sm"
          :text="$t('button.add')"
          data-cy="add-categories-button"
          @click="onClickAddCategory(mainCategories.income)"
        />
      </div>

      <OurTableList
        :list="incomeCategories"
        nesting
        group="income"
        @clickEdit="onClickEditCategory"
        @clickDelete="onClickDeleteCategory"
        @dragSort="onDragSort"
      >
        <template #icons>
          <OurSvgIcon class="icon" name="Hidden" color="blue" interactive />
        </template>
      </OurTableList>
    </OurCard>

    <OurCard class="card">
      <div class="card-header">
        <h3 class="card-header-title">
          {{ $t("label.cashFlowTypes.expense") }}
        </h3>

        <OurButton
          v-if="isMobileDevice"
          size="sm"
          @click="onClickAddCategory(mainCategories.expense)"
        >
          <template #icon-left>
            <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
          </template>
        </OurButton>

        <OurButton
          v-else
          size="sm"
          :text="$t('button.add')"
          @click="onClickAddCategory(mainCategories.expense)"
        />
      </div>
      <OurTableList
        :list="expenseCategories"
        data-cy="expense-list"
        nesting
        group="expense"
        @clickEdit="onClickEditCategory"
        @clickDelete="onClickDeleteCategory"
        @dragSort="onDragSort"
      >
        <template #icons>
          <OurSvgIcon class="icon" name="Hidden" color="blue" interactive />
        </template>
      </OurTableList>
    </OurCard>

    <OurCard class="card">
      <div class="card-header">
        <h3 class="card-header-title">
          {{ $t("label.cashFlowTypes.transfer") }}
        </h3>

        <OurButton
          v-if="isMobileDevice"
          size="sm"
          @click="onClickAddCategory(mainCategories.transfer)"
        >
          <template #icon-left>
            <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
          </template>
        </OurButton>

        <OurButton
          v-else
          size="sm"
          :text="$t('button.add')"
          @click="onClickAddCategory(mainCategories.transfer)"
        />
      </div>
      <OurTableList
        :list="transferCategories"
        nesting
        group="transfer"
        @clickEdit="onClickEditCategory"
        @clickDelete="onClickDeleteCategory"
        @dragSort="onDragSort"
      >
        <template #icons>
          <OurSvgIcon class="icon" name="Hidden" color="blue" interactive />
        </template>
      </OurTableList>
    </OurCard>

    <DeleteModal
      v-model="isShownModal"
      :item="selectedRow"
      @confirmDeleteCategory="onConfirmDeleteCategory"
    />
  </OurPage>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { CATEGORY_ACTIVITIES } from "@/api/category";

import DeleteModal from "../delete/Modal";
import draggable from "vuedraggable";

export default {
  components: {
    DeleteModal,
    draggable,
  },

  data() {
    return {
      isShownModal: false,
      selectedRow: {},
      incomeCategories: [],
      expenseCategories: [],
      transferCategories: [],
      mainCategories: {
        income: CATEGORY_ACTIVITIES.income,
        expense: CATEGORY_ACTIVITIES.expense,
        transfer: CATEGORY_ACTIVITIES.transfer,
      },
    };
  },

  computed: {
    ...mapState("category", ["categories"]),

    ...mapGetters("category", ["filteredCategoriesByType"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.settings"),
        name: "SettingsList",
      };
    },
  },

  async created() {
    await this.getCategories();

    this.createCategoriesByType();
  },

  methods: {
    ...mapActions("category", ["getCategories", "updateCategorySort", "updateCategorySort"]),

    onConfirmDeleteCategory() {
      this.createCategoriesByType();
    },

    createCategoriesByType() {
      this.incomeCategories = this.filteredCategoriesByType(this.mainCategories.income);
      this.expenseCategories = this.filteredCategoriesByType(this.mainCategories.expense);
      this.transferCategories = this.filteredCategoriesByType(this.mainCategories.transfer);
    },

    async onDragSort(categories) {
      await this.updateCategorySort({ categories: categories });
    },

    onClickAddCategory(type) {
      this.$router.push({ name: "CategoryAdd", query: { type: type } });
    },

    onClickEditCategory(id) {
      this.$router.push({ name: "CategoryEdit", params: { id } });
    },

    onClickDeleteCategory(id, name) {
      this.selectedRow.id = id;
      this.selectedRow.name = name;
      this.isShownModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.card {
  @apply mb-4;
}

.card:last-child {
  @apply mb-0;
}

.card::v-deep {
  @apply space-y-0;
}

.card-header {
  @apply mb-6 flex items-center justify-between;
}

.card-header-title {
  @apply text-2xl font-medium text-base-dark;
}

.add-button-icon {
  &::v-deep g [fill] {
    @apply opacity-100;
  }
}
</style>
