<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.tag.edit')"
    width="md"
    data-cy="edit-tags-page"
  >
    <TagForm ref="companyForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        data-cy="back-button"
        variant="secondary"
        @click="onClickBackToTagList"
      />
    </template>

    <template #footer-right>
      <OurDropdown :text="$t('button.more')" variant="thirdary" data-cy="edit-tag-dropdown">
        <div data-cy="dropdown-delete-button" @click="onClickDeleteTag">
          {{ $t("button.delete") }}
        </div>
      </OurDropdown>
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";
import TagForm from "../_components/TagForm";
import DeleteModal from "../delete/Modal";

export default {
  name: "TagEdit",

  components: {
    TagForm,
    DeleteModal,
  },

  data() {
    return {
      form: {
        id: "",
        name: "",
        comment: "",
      },
      isShownModal: false,
    };
  },

  computed: {
    ...mapState("tag", ["tag"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.tag.list"),
        name: "TagList",
      };
    },
  },

  watch: {
    tag(tag) {
      this.form.id = tag.id;
      this.form.name = tag.name;
      this.form.comment = tag.comment;
    },
  },

  async created() {
    const tagId = this.$route.params.id;

    await this.getTag(tagId);
  },

  methods: {
    ...mapActions("tag", ["getTag", "updateTag"]),

    onClickBackToTagList() {
      router.push({ name: "TagList" });
    },

    async onSubmitForm() {
      this.$refs.companyForm.validate();

      const tag = { id: this.tag.id, ...this.form };

      if (this.form.isValid) {
        await this.updateTag(tag);
      }
    },

    onClickDeleteTag() {
      this.isShownModal = true;
    },
  },
};
</script>
