<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.company.list')"
    width="md"
    data-cy="companies-page"
  >
    <template #header-right>
      <OurButton
        v-if="isMobileDevice"
        data-cy="add-companies-button"
        size="sm"
        @click="onClickAddCompany"
      >
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton
        v-else
        data-cy="add-companies-button"
        size="sm"
        :text="$t('button.add')"
        @click="onClickAddCompany"
      />
    </template>

    <OurCard class="card">
      <OurTableList
        :list="companies"
        group="companies"
        data-cy="companies-list"
        @clickEdit="onClickEditCompany"
        @clickDelete="onClickDeleteCompany"
        @dragSort="onDragSort"
      >
        <template #icons>
          <OurSvgIcon class="icon" name="Hidden" color="blue" interactive />
        </template>
      </OurTableList>
    </OurCard>

    <DeleteModal v-model="isShownModal" :item="selectedRow" />
  </OurPage>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";

import DeleteModal from "../delete/Modal";

export default {
  components: {
    DeleteModal,
    draggable,
  },

  data() {
    return {
      isShownModal: false,
      selectedRow: {},
    };
  },

  computed: {
    ...mapState("company", ["companies"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.settings"),
        name: "SettingsList",
      };
    },
  },

  async created() {
    await this.getCompanies();
  },

  methods: {
    ...mapActions("company", ["getCompanies", "updateCompanySort"]),

    async onDragSort(companies) {
      const companyIds = companies.map((item) => item.id);

      await this.updateCompanySort({ companyIds });
    },

    onClickAddCompany() {
      this.$router.push({ name: "CompanyAdd" });
    },

    onClickEditCompany(id) {
      this.$router.push({ name: "CompanyEdit", params: { id } });
    },

    onClickDeleteCompany(id, name) {
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
