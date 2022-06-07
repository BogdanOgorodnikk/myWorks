<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.setting.category.delete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteCategory"
  >
    <div v-html="$t('page.setting.category.deleteModalText', { title: item.name })" />
  </OurConfirmModal>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    item: {
      type: Object,
      default: () => {},
    },

    delaySuccessNotify: {
      type: Boolean,
      default: false,
    },
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
    ...mapActions("category", ["deleteCategory"]),

    async onConfirmDeleteCategory() {
      await this.deleteCategory({
        categoryId: this.item.id,
        currentRoute: this.$route.name,
        delaySuccessNotify: this.delaySuccessNotify,
      });

      this.$emit("confirmDeleteCategory");
    },
  },
};
</script>
