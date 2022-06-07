<template>
  <OurPage :title="$t('title.setting.contragent.list')" width="3xl">
    <template #header-right>
      <div v-if="isMobileDevice" class="contragent-actions">
        <OurButton size="sm" variant="thirdary" @click="onClickGoToFilterPage">
          <template #icon-left>
            <OurSvgIcon size="xs" name="Filter" />
          </template>
        </OurButton>

        <OurButton size="sm" @click="onClickAddContragent">
          <template #icon-left>
            <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
          </template>
        </OurButton>
      </div>

      <div v-else class="contragent-actions">
        <OurButton
          size="sm"
          :text="$t('button.filters')"
          variant="thirdary"
          @click="onClickOpenFilterModal"
        >
          <template #icon-left>
            <OurSvgIcon size="xs" name="Filter" />
          </template>
        </OurButton>

        <OurButton size="sm" :text="$t('button.add')" @click="onClickAddContragent" />
      </div>
    </template>

    <OurTable
      class="contragent-table"
      selectable
      :headers="tableHeaders"
      :items="tableItems"
      width="w-175"
      @clickRow="onClickRow"
    >
      <template #thead-actions="{ selectedRows }">
        <OurButton
          variant="thirdary"
          :text="$t('button.delete')"
          size="sm"
          @click="onClickDeleteContragents(selectedRows)"
        />
      </template>

      <template #cell-icon>
        <OurSvgIcon
          :tooltip="$t('label.openInCRM')"
          class="address-card-icon"
          name="Address-card"
        />
      </template>
    </OurTable>

    <FilterModal v-model="isShownFilterModal" />
  </OurPage>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { CONTRAGENT_TYPE } from "@/api/contragent";

import FilterModal from "./components/FilterModal";

export default {
  components: {
    FilterModal,
  },

  data() {
    return {
      isShownFilterModal: false,
      tableHeaders: [
        {
          value: "name",
          text: this.$t("label.name"),
          thClass: "md:w-80 w-30",
        },
        {
          value: "tags",
          text: this.$t("label.type"),
        },
        {
          value: "taxNumber",
          text: this.$t("label.taxNumber"),
        },
        {
          value: "icon",
          thClass: "w-16",
        },
      ],
      tableItems: [],
    };
  },

  computed: {
    ...mapState("contragent", ["contragents"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),
  },

  watch: {
    contragents: {
      handler: "onChangeContragents",
      deep: true,
      immediate: true,
    },
  },

  async created() {
    await this.getContragents();
  },

  methods: {
    ...mapActions("contragent", ["getContragents", "deleteContragent"]),

    onClickOpenFilterModal() {
      this.isShownFilterModal = true;
    },

    onClickGoToFilterPage() {
      this.$router.push({ name: "ContragentsFilter" });
    },

    onChangeContragents() {
      this.tableItems = this.contragents.map((item) => ({
        isChecked: false,
        id: item.id,
        name: {
          primaryRow: item.name,
          secondaryRow: item.comment,
        },
        tags: this.setContragentType(item.type),
        taxNumber: item?.taxNumber || "",
        icon: "",
      }));
    },

    setContragentType(type) {
      const [contactType, companyType] = CONTRAGENT_TYPE;
      let contragentType = {};

      if (type === contactType.value) {
        contragentType = {
          variant: "green",
          tags: [this.$t("label.contact")],
        };
      } else if (type === companyType.value) {
        contragentType = {
          variant: "yellow",
          tags: [this.$t("label.company")],
        };
      } else {
        contragentType = {
          variant: "violet",
          tags: [this.$t("label.employee")],
        };
      }

      return contragentType;
    },

    onClickRow(row) {
      this.editContragent(row.id);
    },

    editContragent(id) {
      this.$router.push({ name: "ContragentEdit", params: { id } });
    },

    async onClickDeleteContragents(contragents) {
      await contragents.forEach((item) => {
        this.deleteContragent({
          contragentId: this.tableItems[item].id,
          currentRoute: this.$route.name,
        });
        this.tableItems.splice(item, 1);
      });

      const contragentsLength = contragents.length;

      contragents.splice(0, contragentsLength);
    },

    onClickAddContragent() {
      this.$router.push({ name: "ContragentAdd" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.contragent {
  &-actions {
    @apply flex space-x-4;
  }

  &-table {
    &::v-deep {
      .table-row {
        &:hover {
          .address-card-icon g [fill] {
            @apply text-gray-500;
          }
        }
      }
    }
  }
}

.add-button-icon {
  &::v-deep g [fill] {
    @apply opacity-100;
  }
}

.address-card-icon {
  @apply cursor-pointer;

  &::v-deep g [fill] {
    @apply text-gray-300;
  }
}
</style>
