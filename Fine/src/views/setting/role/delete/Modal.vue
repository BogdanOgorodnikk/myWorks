<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.setting.role.delete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteRole"
  >
    <div v-html="$t('page.setting.role.deleteModalText', { title: item.name })" />
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
    ...mapActions("role", ["deleteRole"]),

    async onConfirmDeleteRole() {
      await this.deleteRole({
        roleId: this.item.id,
        currentRoute: this.$route.name,
        delaySuccessNotify: this.delaySuccessNotify,
      });
    },
  },
};
</script>
