<template>
  <div>
    <OurCard class="card">
      <div v-if="isEditType" class="card-title">{{ $t("title.editContact") }}</div>
      <div v-else class="card-title">{{ $t("title.addContact") }}</div>

      <div class="contact-address-block">
        <OurSelect
          v-model="form.contactRoleType"
          :options="contactRoles"
          open-direction="bottom"
          class="input-card-state"
          :label="$t('label.contactType')"
        />
        <OurSelect
          v-model="existingContact"
          :options="existingContactOptions"
          open-direction="bottom"
          class="input-card-state"
          :label="$t('label.useSavedContact')"
          @change="onChangeExistingContact"
        />
        <div class="contact-line">
          <OurInput
            v-model="form.firstName"
            class="contact-line-input"
            :error="nameError"
            :label="$t('label.firstName')"
          />
          <OurInput
            v-model="form.lastName"
            class="contact-line-input contact-line-input-first"
            :error="lastNameError"
            :label="$t('label.lastName')"
          />
        </div>
        <OurPhoneInput
          v-model="form.primaryPhone"
          :label="$t('label.phoneNumber')"
          :placeholder="$t('placeholder.phone')"
          mode="national"
          :enabled-flags="false"
          :show-dial-code="false"
          :default-country="preparedCountry"
          :only-countries="[preparedCountry]"
          :error="phoneError"
        >
          <template #arrow-icon>
            <div />
          </template>
        </OurPhoneInput>
        <OurPhoneInput
          v-model="form.secondaryPhone"
          :label="$t('label.secondaryPhoneNumberOptional')"
          :placeholder="$t('placeholder.phone')"
          mode="national"
          :enabled-flags="false"
          :show-dial-code="false"
          :default-country="preparedCountry"
          :only-countries="[preparedCountry]"
          :error="secondaryPhoneError"
        >
          <template #arrow-icon>
            <div />
          </template>
        </OurPhoneInput>
        <OurInput
          v-model="form.primaryEmail"
          :label="$t('label.email')"
          :placeholder="$t('placeholder.email')"
          :error="emailError"
        />
        <OurInput
          v-model="form.secondaryEmail"
          :label="$t('label.secondaryEmailOptional')"
          :placeholder="$t('placeholder.email')"
          :error="secondaryEmailError"
        />
      </div>
    </OurCard>
    <div class="register-wrapper">
      <div></div>

      <OurButton
        class="register-wrapper-button"
        :text="$t('button.save')"
        size="lg"
        @click="onClickEditContact"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required, email, helpers } from "vuelidate/lib/validators";
import ValidationService from "@/services/validate.service";
const optionalPhoneMinLength = (value) => !helpers.req(value) || phoneMinLength(value);

const { phoneMinLength, phoneMaxLength } = ValidationService;

export default {
  name: "UpdateContact",

  props: {
    type: {
      type: String,
      default: "edit",
    },
    givenContact: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      preparedCountry: "US",
      existingContactOptions: [],
      existingContact: null,
      form: {
        firstName: "",
        lastName: "",
        primaryPhone: "",
        secondaryPhone: "",
        primaryEmail: "",
        secondaryEmail: "",
        contactRoleType: "BILLING",
      },
    };
  },
  validations() {
    return {
      form: {
        firstName: { required },
        lastName: { required },
        primaryPhone: { required, phoneMinLength, phoneMaxLength },
        secondaryPhone: { optionalPhoneMinLength, phoneMaxLength },
        primaryEmail: { required, email },
        secondaryEmail: { email },
      },
    };
  },
  computed: {
    ...mapGetters(["account", "contactRoles"]),

    nameError() {
      const isDirty = this.$v.form.firstName.$dirty;
      const isFilled = this.$v.form.firstName.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    lastNameError() {
      const isDirty = this.$v.form.lastName.$dirty;
      const isFilled = this.$v.form.lastName.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    emailError() {
      const isDirty = this.$v.form.primaryEmail.$dirty;
      const isFilled = this.$v.form.primaryEmail.required;
      const isEmail = this.$v.form.primaryEmail.email;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isEmail) {
        error = this.$t("validation.mustBeEmail");
      }

      return error;
    },
    secondaryEmailError() {
      const isDirty = this.$v.form.secondaryEmail.$dirty;
      const isEmail = this.$v.form.secondaryEmail.email;

      let error = "";

      if (isDirty && !isEmail) {
        error = this.$t("validation.mustBeEmail");
      }

      return error;
    },
    phoneError() {
      const isDirty = this.$v.form.primaryPhone.$dirty;
      const isFilled = this.$v.form.primaryPhone.required;
      const isMinLength = this.$v.form.primaryPhone.phoneMinLength;
      const isMaxLength = this.$v.form.primaryPhone.phoneMaxLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isMinLength) {
        error = this.$t("validation.phoneLength");
      } else if (isDirty && !isMaxLength) {
        error = this.$t("validation.phoneLength");
      }

      return error;
    },
    secondaryPhoneError() {
      const isDirty = this.$v.form.secondaryPhone.$dirty;
      const isMinLength = this.$v.form.secondaryPhone.optionalPhoneMinLength;
      const isMaxLength = this.$v.form.secondaryPhone.phoneMaxLength;

      let error = "";

      if (isDirty && !isMinLength) {
        error = this.$t("validation.phoneLength");
      } else if (isDirty && !isMaxLength) {
        error = this.$t("validation.phoneLength");
      }

      return error;
    },
    isEditType() {
      return this.type === "edit";
    },
  },

  created() {
    this.fillForm();
  },

  methods: {
    ...mapActions(["updateContact", "postContact"]),

    onChangeExistingContact() {
      const contact = this.account.contacts.find((contact) => contact.uid === this.existingContact);

      this.form.firstName = contact?.firstName;
      this.form.lastName = contact?.lastName;
      this.form.primaryPhone = contact?.primaryPhone || "";
      this.form.primaryEmail = contact?.primaryEmail;
      this.form.secondaryPhone = contact?.secondaryPhone || "";
      this.form.secondaryEmail = contact?.secondaryEmail;
      this.form.contactRoleType = this.contactRoles.find(
        (contactRole) => contactRole.label === contact?.contactRoleType
      ).id;
    },
    fillForm() {
      this.form.firstName = this.givenContact.firstName;
      this.form.lastName = this.givenContact.lastName;
      this.form.primaryPhone = this.givenContact.primaryPhone || "";
      this.form.secondaryPhone = this.givenContact.secondaryPhone || "";
      this.form.primaryEmail = this.givenContact.primaryEmail;
      this.form.secondaryEmail = this.givenContact.secondaryEmail;
      this.form.contactRoleType = this.contactRoles.find(
        (contactRole) => contactRole.label === this.givenContact.contactRoleType
      )?.id;

      this.existingContactOptions = this.account.contacts.map((contact) => ({
        id: contact.uid,
        label: `${contact.firstName} ${contact.lastName}`,
      }));
    },

    onClickEditContact() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      let contact = { ...this.givenContact };

      contact.firstName = this.form.firstName;
      contact.lastName = this.form.lastName;
      contact.primaryPhone = this.form.primaryPhone;
      contact.secondaryPhone = this.form.secondaryPhone;
      contact.primaryEmail = this.form.primaryEmail;
      contact.secondaryEmail = this.form.secondaryEmail;
      contact.contactRoleType = this.contactRoles.find(
        (contactRole) => contactRole.id === this.form.contactRoleType
      ).label;

      if (this.type === "edit") {
        this.updateContact({ type: this.givenContact.contactRoleType, newContact: contact });
      } else {
        contact.role = contact.contactRoleType;
        this.postContact(contact);
      }

      this.$emit("updated");
    },
  },
};
</script>

<style lang="postcss" scoped>
.card {
  @apply w-full !important;
  @apply space-y-8;

  &-title {
    @apply text-2lg font-bold text-base-dark;
  }
}

.register {
  @apply w-full max-w-full;

  &-title {
    @apply text-center text-4xl font-bold text-base-dark;
    @apply mb-2 mt-4;
  }

  &-wrapper {
    @apply flex justify-between;
    @apply max-w-2xl;
    @apply mx-auto px-6;

    &-button {
      @apply mt-6 w-auto !important;
    }
  }
}

.contact {
  &-address-block {
    @apply space-y-6;
  }
  &-line {
    @apply flex;

    &-input {
      @apply w-full;
    }
    &-input-first {
      @apply ml-4;
    }
  }
  &-wrapper {
    @apply flex space-x-6;

    .input-card-country {
      @apply w-96;
    }
    .input-card-state {
      @apply w-[32rem];
    }
  }
}

.separated-border {
  @apply border-b border-dashed border-gray-300;
}
</style>
