<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.setting.tag.delete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteTag"
  >
    <div v-html="$t('page.setting.tag.deleteModalText', { title: item.name })" />
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
    ...mapActions("tag", ["deleteTag"]),

    async onConfirmDeleteTag() {
      await this.deleteTag({
        tagId: this.item.id,
        currentRoute: this.$route.name,
        delaySuccessNotify: this.delaySuccessNotify,
      });
    },
  },
};
</script>
