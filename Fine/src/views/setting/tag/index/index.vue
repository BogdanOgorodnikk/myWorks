<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.tag.list')"
    width="md"
    data-cy="tags-page"
  >
    <template #header-right>
      <OurButton v-if="isMobileDevice" data-cy="add-tag-button" size="sm" @click="onClickAddTag">
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton
        v-else
        data-cy="add-tag-button"
        size="sm"
        :text="$t('button.add')"
        @click="onClickAddTag"
      />
    </template>

    <OurCard class="card">
      <OurTableList
        :list="tags"
        group="tags"
        data-cy="tags-list"
        @clickEdit="onClickEditTag"
        @clickDelete="onClickDeleteTag"
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
    ...mapState("tag", ["tags"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.settings"),
        name: "SettingsList",
      };
    },
  },

  async created() {
    await this.getTags();
  },

  methods: {
    ...mapActions("tag", ["getTags", "updateTagSort"]),

    async onDragSort(tags) {
      const tagIds = tags.map((item) => item.id);

      await this.updateTagSort({ tagIds });
    },

    onClickAddTag() {
      this.$router.push({ name: "TagAdd" });
    },

    onClickEditTag(id) {
      this.$router.push({ name: "TagEdit", params: { id } });
    },

    onClickDeleteTag(id, name) {
      this.selectedRow.id = id;
      this.selectedRow.name = name;
      this.isShownModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.add-button-icon {
  &::v-deep g [fill] {
    @apply opacity-100;
  }
}
</style>
