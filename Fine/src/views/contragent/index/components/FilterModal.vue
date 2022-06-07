<template>
  <OurPageModal
    v-model="isShownModal"
    width="md"
    :title="$t('title.filter')"
    :click-to-close="false"
  >
    <FilterForm v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.find')" @click="onSubmitForm" />

      <OurButton :text="$t('button.close')" variant="secondary" @click="onClickCloseModal" />
    </template>

    <template #footer-right>
      <OurButton variant="thirdary" :text="$t('button.reset')" @click="onClickResetFilters" />
    </template>
  </OurPageModal>
</template>

<script>
import { mapMutations } from "vuex";

import FilterForm from "../../_components/FilterForm";

export default {
  components: {
    FilterForm,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },

  methods: {
    ...mapMutations("contragent", ["SET_FILTERS"]),

    onClickCloseModal() {
      this.isShownModal = false;
    },

    onSubmitForm() {
      this.SET_FILTERS(this.form);

      this.isShownModal = false;
    },

    onClickResetFilters() {
      this.SET_FILTERS({});

      this.isShownModal = false;
    },
  },
};
</script>
