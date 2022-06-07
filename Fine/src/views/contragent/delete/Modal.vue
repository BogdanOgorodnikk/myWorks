<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.setting.contragent.delete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteContragent"
  >
    <div v-html="$t('page.setting.contragent.deleteModalText', { title: item.name })" />
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
    ...mapActions("contragent", ["deleteContragent"]),

    async onConfirmDeleteContragent() {
      await this.deleteContragent({
        contragentId: this.item.id,
        currentRoute: this.$route.name,
        delaySuccessNotify: true,
      });
    },
  },
};
</script>
