<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.role.list')"
    width="md"
    data-cy="roles-page"
  >
    <template #header-right>
      <OurButton v-if="isMobileDevice" data-cy="add-role-button" size="sm" @click="onClickAddRole">
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton
        v-else
        data-cy="add-role-button"
        size="sm"
        :text="$t('button.add')"
        @click="onClickAddRole"
      />
    </template>

    <OurCard>
      <OurTableList
        :list="roles"
        group="roles"
        data-cy="roles-list"
        @dragSort="onDragSort"
        @clickEdit="onClickEditRole"
        @clickDelete="onClickDeleteRole"
      />
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
    ...mapState("role", ["roles"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.settings"),
        name: "SettingsList",
      };
    },
  },

  async created() {
    await this.getRoles();
  },

  methods: {
    ...mapActions("role", ["getRoles", "updateRoleSort"]),

    async onDragSort(roles) {
      const roleIds = roles.map((item) => item.id);

      await this.updateRoleSort({ roleIds });
    },

    onClickAddRole() {
      this.$router.push({ name: "RoleAdd" });
    },

    onClickEditRole(id) {
      this.$router.push({ name: "RoleEdit", params: { id } });
    },

    onClickDeleteRole(id, name) {
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

.icon {
  &-trash {
    @apply cursor-pointer opacity-0;

    &::v-deep g [fill] {
      @apply text-red-500;
    }
  }

  &-edit {
    @apply cursor-pointer;

    &::v-deep {
      & g [fill] {
        @apply cursor-pointer text-gray-300;
      }

      &:hover {
        g [fill] {
          @apply text-gray-500;
        }
      }
    }
  }
}
</style>
