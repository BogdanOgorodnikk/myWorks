<template>
  <OurPage :title="$t('title.setting.account.list')" :back-route="backRouteParams" width="md">
    <template #header-right>
      <OurButton
        v-if="isMobileDevice"
        data-cy="add-companies-button"
        size="sm"
        @click="onClickAddAccount"
      >
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton v-else size="sm" :text="$t('button.add')" @click="onClickAddAccount" />
    </template>

    <OurCard>
      <OurTableList
        :list="accounts"
        group="accounts"
        @clickEdit="onClickEditAccount"
        @clickDelete="onClickDeleteAccount"
        @dragSort="onDragSort"
      >
        <template slot-scope="{ item }">
          <div class="item-block">
            <div class="item-name">{{ item.name }}, {{ item.currency.symbol }}</div>
            <div class="item-description">
              {{ item.company.name }}
            </div>
          </div>
        </template>

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
  name: "AccountList",

  components: {
    DeleteModal,
    draggable,
  },

  data() {
    return {
      selectedRow: {},
      isShownModal: false,
    };
  },

  computed: {
    ...mapState("bankAccount", ["accounts"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.settings"),
        name: "SettingsList",
      };
    },
  },

  async created() {
    await this.getAccounts();
  },

  methods: {
    ...mapActions("bankAccount", ["getAccounts", "updateAccountSort"]),

    onClickAddAccount() {
      this.$router.push({ name: "AccountAdd" });
    },

    async onDragSort(accounts) {
      const accountIds = accounts.map((item) => item.id);

      await this.updateAccountSort({ accountIds });
    },

    onClickEditAccount(id) {
      this.$router.push({ name: "AccountEdit", params: { id } });
    },

    onClickDeleteAccount(id, name) {
      this.selectedRow.id = id;
      this.selectedRow.name = name;
      this.isShownModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.item {
  &-block {
    @apply flex-auto;
    @apply ml-5 pt-px;
  }

  &-name {
    @apply text-base font-normal text-base-dark;
  }

  &-description {
    @apply text-xs font-normal text-gray-500;
    @apply pt-1;
  }
}

.add-button-icon {
  &::v-deep g [fill] {
    @apply opacity-100;
  }
}
</style>
