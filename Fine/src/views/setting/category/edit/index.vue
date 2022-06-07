<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.category.edit')"
    width="md"
    data-cy="edit-categories-page"
  >
    <CategoryForm ref="categoryForm" v-model="form" />

    <template #footer-left>
      <OurButton data-cy="submit-button" :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton
        data-cy="back-button"
        :text="$t('button.back')"
        variant="secondary"
        @click="onClickBackToCategoryList"
      />
    </template>

    <template #footer-right>
      <OurDropdown
        data-cy="edit-categories-dropdown"
        :text="$t('button.more')"
        variant="thirdary"
        list-position="top"
      >
        <div data-cy="dropdown-delete-button" @click="onClickDeleteCategory">
          {{ $t("button.delete") }}
        </div>
        <div>{{ $t("button.show") }}</div>
        <div>{{ $t("button.hide") }}</div>
      </OurDropdown>
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";

import router from "@/router";
import CategoryForm from "../_components/CategoryForm";
import DeleteModal from "../delete/Modal";

export default {
  components: {
    CategoryForm,
    DeleteModal,
  },

  data: () => ({
    form: {
      id: "",
      name: "",
      description: "",
      type: "",
      activity: "",
      parentId: null,
    },
    isShownModal: false,
  }),

  computed: {
    ...mapState("category", ["category"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.category.list"),
        name: "CategoryList",
      };
    },
  },

  watch: {
    category(category) {
      this.form.id = category.id;
      this.form.name = category.name;
      this.form.description = category.description;
      this.form.type = category.type || "";
      this.form.activity = category.activity || "";
      this.form.parentId = category.parent?.id || "";
    },
  },

  async created() {
    const categoryId = this.$route.params.id;

    await this.getCategory(categoryId);
  },

  methods: {
    ...mapActions("category", ["getCategory", "updateCategory"]),

    onClickBackToCategoryList() {
      router.push({ name: "CategoryList" });
    },

    async onSubmitForm() {
      this.$refs.categoryForm.validate();

      const category = { id: this.category.id, ...this.form };

      if (this.form.isValid) {
        await this.updateCategory(category);
      }
    },

    onClickDeleteCategory() {
      this.isShownModal = true;
    },
  },
};
</script>
