<template>
  <div class="user-form">
    <OurCard>
      <OurInput
        v-if="editForm"
        v-model="form.name"
        :label="$t('label.userName')"
        :placeholder="$t('placeholder.name')"
        disabled
      />

      <OurInput
        v-model="form.email"
        :label="$t('label.email')"
        :placeholder="$t('placeholder.email')"
        :error="userEmailError"
        :disabled="editForm"
      />

      <OurSelect
        v-model="form.roleId"
        :label="$t('label.role')"
        :placeholder="$t('placeholder.role')"
        :error="userRoleError"
        :options="rolesForSelect"
      />

      <div class="user-form-buttons">
        <OurButton variant="link" :text="$t('button.createRole')" @click="onClickCreateRole" />

        <OurButton variant="link" :text="$t('button.editRole')" @click="onClickEditRole" />
      </div>
    </OurCard>
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import router from "@/router";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },

    editForm: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isPrefilledForm: false,
      form: {
        email: "",
        roleId: "",
      },
    };
  },

  validations: {
    form: {
      email: { required, email },
      roleId: { required },
    },
  },

  computed: {
    ...mapGetters("role", ["rolesForSelect"]),

    userEmailError() {
      const isDirty = this.$v.form.email.$dirty;
      const isFilled = this.$v.form.email.required;
      const isEmail = this.$v.form.email.email;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isEmail) {
        error = this.$t("validation.mustBeEmail");
      }

      return error;
    },

    userRoleError() {
      const isDirty = this.$v.form.roleId.$dirty;
      const isFilled = this.$v.form.roleId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
    value: {
      handler: "onChangeValue",
      deep: true,
    },
  },

  async created() {
    await this.getRoles();
  },

  methods: {
    ...mapActions("role", ["getRoles"]),

    onChangeValue() {
      if (!this.isPrefilledForm) {
        this.prefillForm();
      }
    },

    prefillForm() {
      this.form.name = this.value.name;
      this.form.email = this.value.email;
      this.form.roleId = this.value.roleId;

      this.isPrefilledForm = true;
    },

    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;

      this.$emit("input", this.form);
    },

    validate() {
      this.$v.$touch();
    },

    onClickCreateRole() {
      router.push({ name: "RoleAdd" });
    },

    onClickEditRole() {
      this.$v.form.roleId.$touch();

      if (this.form.roleId) {
        router.push({ name: "RoleEdit", params: { id: this.form.roleId } });
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.user {
  &-form {
    &-buttons {
      @apply flex;
      @apply mx-4 !mt-3 space-x-4;
    }
  }
}
</style>
