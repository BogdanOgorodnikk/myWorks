<template>
  <div>
    <OurMultiselect
      v-if="multiple"
      v-model="selectValue"
      :label="label"
      :group-label="groupLabel"
      :group-values="groupValues"
      :placeholder="placeholder"
      :required="required"
      :error="error"
      :disabled="disabled"
      :value-key="trackBy"
      :open-direction="openDirection"
      :description="description"
      :width="width"
      :options="selectOptions"
    >
      <template #tag-title="{ tag }">
        {{ tag.label }}
        <span class="account-select-company">{{ $t("label.in") }} {{ tag.company }}</span>
      </template>
    </OurMultiselect>

    <OurSelect
      v-else
      v-model="selectValue"
      :label="label"
      :group-label="groupLabel"
      :group-values="groupValues"
      :placeholder="placeholder"
      :required="required"
      :error="error"
      :disabled="disabled"
      :value-key="trackBy"
      :open-direction="openDirection"
      :description="description"
      :width="width"
      :options="selectOptions"
      @change="onChange"
    >
      <template #singleLabel="{ scopeProps }">
        {{ scopeProps.option.label }}
        <span class="account-select-company"
          >{{ $t("label.in") }} {{ scopeProps.option.company }}</span
        >
      </template>
    </OurSelect>
  </div>
</template>

<script>
import i18n from "@/plugins/vue-i18n";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    value: {
      type: [String, Number, Array],
      default: "",
    },

    label: {
      type: String,
      default: i18n.t("label.account"),
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    options: {
      type: Array,
      default: () => [],
    },

    groupLabel: {
      type: String,
      default: "company",
    },

    placeholder: {
      type: String,
      default: "",
    },

    required: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: function () {
        this.$t("validation.required");
      },
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    groupValues: {
      type: String,
      default: "accounts",
    },

    trackBy: {
      type: String,
      default: "id",
    },

    openDirection: {
      type: String,
      default: "bottom",
    },

    description: {
      type: String,
      default: "",
    },

    width: {
      type: String,
      default: "w-full",
    },
  },

  computed: {
    ...mapGetters("bankAccount", ["bankAccountsGroupedByCompanies"]),

    selectValue: {
      get() {
        return this.value;
      },
      set(newItem) {
        this.$emit("input", newItem);
      },
    },

    selectOptions() {
      return this.options.length ? this.options : this.bankAccountsGroupedByCompanies;
    },
  },

  async created() {
    await Promise.all([this.getAccounts(), this.getCompanies()]);
  },

  methods: {
    ...mapActions("bankAccount", ["getAccounts"]),
    ...mapActions("company", ["getCompanies"]),

    onChange() {
      this.$emit("change");
    },
  },
};
</script>

<style lang="postcss" scoped>
.account-select-company {
  @apply text-sm font-normal text-gray-500;
}
</style>
