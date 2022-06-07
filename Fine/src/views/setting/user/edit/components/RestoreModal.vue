<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.restoreUser')"
    :action-button-text="$t('button.restore')"
    @actionConfirmed="onConfirmRestoreUser"
  >
    <div v-html="$t('page.setting.user.restoreModalText', { title: item.name || item.email })" />
  </OurConfirmModal>
</template>

<script>
import { mapActions } from "vuex";

import notify from "@ilevel/our.service.notify";

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
    ...mapActions("user", ["updateUser"]),

    async onConfirmRestoreUser() {
      await this.updateUser({
        id: this.item.id,
        isActive: true,
        currentRoute: this.$route.name,
        delaySuccessNotify: true,
      });

      notify.success("userRestored");
    },
  },
};
</script>
