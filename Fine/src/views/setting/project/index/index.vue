<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.project.list')"
    width="md"
    data-cy="project-page"
  >
    <template #header-right>
      <OurButton
        v-if="isMobileDevice"
        data-cy="add-project-button"
        size="sm"
        @click="onClickAddProject"
      >
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton
        v-else
        data-cy="add-project-button"
        size="sm"
        :text="$t('button.add')"
        @click="onClickAddProject"
      />
    </template>

    <OurCard class="card">
      <OurTableList
        data-cy="projects-list"
        :list="projects"
        group="projects"
        @clickEdit="onClickEditProject"
        @clickDelete="onClickDeleteProject"
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
    ...mapState("project", ["projects"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.settings"),
        name: "SettingsList",
      };
    },
  },

  async created() {
    await this.getProjects();
  },

  methods: {
    ...mapActions("project", ["getProjects", "updateProjectSort"]),

    async onDragSort(projects) {
      const projectIds = projects.map((item) => item.id);

      await this.updateProjectSort({ projectIds });
    },

    onClickAddProject() {
      this.$router.push({ name: "ProjectAdd" });
    },

    onClickEditProject(id) {
      this.$router.push({ name: "ProjectEdit", params: { id } });
    },

    onClickDeleteProject(id, name) {
      this.selectedRow.id = id;
      this.selectedRow.name = name;
      this.isShownModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.card {
  @apply mb-4;
}

.card:last-child {
  @apply mb-0;
}

.card::v-deep {
  @apply space-y-0;
}

.add-button-icon {
  &::v-deep g [fill] {
    @apply opacity-100;
  }
}
</style>
