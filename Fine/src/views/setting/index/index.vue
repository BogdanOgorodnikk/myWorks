<template>
  <OurPage data-cy="settings-page" width="2xl" class="settings">
    <div v-for="(link, index) in links" :key="index" class="settings-wrapper">
      <h2 class="settings-title">{{ link.headline }}</h2>

      <div class="settings-cards">
        <SectionCard v-for="(item, id) in link.items" :key="id" :item="item" />
      </div>
    </div>
  </OurPage>
</template>

<script>
import SectionCard from "@/components/SectionCard";
import i18n from "@/plugins/vue-i18n";

const LINKS = [
  {
    headline: i18n.t("title.setting._"),
    items: [
      {
        title: i18n.t("title.setting.common._"),
        route: "General",
        description: i18n.t("description.common"),
      },
      {
        title: i18n.t("title.setting.category._"),
        route: "CategoryList",
        description: i18n.t("description.categories"),
      },
      {
        title: i18n.t("title.setting.company.list"),
        route: "CompanyList",
        description: i18n.t("description.company"),
      },
      {
        title: i18n.t("title.setting.account.list"),
        route: "AccountList",
        description: i18n.t("description.account"),
      },
      {
        title: i18n.t("title.setting.user.list"),
        route: "UserList",
        description: i18n.t("description.user"),
      },
      {
        title: i18n.t("title.setting.role.list"),
        route: "RoleList",
        description: i18n.t("description.role"),
      },
      {
        title: i18n.t("title.setting.tag.list"),
        route: "TagList",
        description: i18n.t("description.tag"),
      },
      {
        title: i18n.t("title.setting.project.list"),
        route: "ProjectList",
        description: i18n.t("description.projects"),
      },
    ],
  },
  {
    headline: i18n.t("title.setting.integrations._"),
    items: [
      {
        title: i18n.t("title.setting.integrations.bitrix24._"),
        route: "Integrations-Bitrix24",
        description: i18n.t("description.bitrix24"),
      },
    ],
  },
];

export default {
  components: {
    SectionCard,
  },

  data: () => ({
    links: LINKS,
  }),
};
</script>

<style lang="postcss" scoped>
.settings {
  &::v-deep {
    .page-header {
      @apply mb-0;
    }
  }

  &-wrapper {
    @apply mt-12;

    &:first-child {
      @apply mt-0;
    }
  }

  &-title {
    @apply mb-6 text-4xl font-medium text-base-dark;
  }

  &-cards {
    @apply grid grid-cols-1 grid-rows-1 gap-4 sm:grid-cols-2 md:gap-6;
  }
}
</style>
