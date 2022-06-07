<template>
  <div class="register">
    <OurLogo class="register-logo" :path="logoPath" />

    <div class="register-title">{{ $t("title.signUp") }}</div>

    <div class="register-help-wrapper">
      <div class="register-help-title">{{ $t("title.help") }}</div>

      <OurLink
        dashed
        router-link
        :route="contactUsRoute"
        class="register-help-link"
        :text="$t('button.contactUs')"
        variant="secondary"
        size="lg"
      />
    </div>

    <OurCard class="card">
      <OurIconStepper class="icon-step" />

      <div class="card-title">{{ $t("page.signUp.provideInformation") }}</div>

      <div class="card-block">
        <div class="card-wrapper">
          <OurInput
            v-model="form.firstName"
            class="card-input"
            :label="$t('label.firstName')"
            :placeholder="$t('placeholder.firstName')"
            :error="nameError"
          />

          <OurInput
            v-model="form.lastName"
            class="card-input"
            :label="$t('label.lastName')"
            :placeholder="$t('placeholder.lastName')"
            :error="lastNameError"
          />
        </div>

        <div class="card-wrapper">
          <OurInput
            v-model="form.email"
            class="card-input"
            :label="$t('label.email')"
            :placeholder="$t('placeholder.email')"
            :error="emailError"
          />

          <OurPhoneInput
            v-model="form.phone"
            class="card-input"
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
        </div>

        <div class="card-wrapper">
          <div class="password-wrapper">
            <OurInput
              v-model="form.password"
              class="card-input"
              :label="$t('label.password')"
              :placeholder="$t('placeholder.password')"
              type="password"
              :error="passwordError"
            />

            <OurPasswordMeter :password="form.password" />
          </div>

          <OurInput
            v-model="form.company"
            class="card-input"
            :label="$t('label.company')"
            :placeholder="$t('placeholder.company')"
          />
        </div>

        <div class="card-separator" />

        <OurInput
          v-model="form.serviceAdress"
          :label="$t('label.serviceAdress')"
          :error="serviceAdressError"
        />

        <OurInput
          v-model="form.unitAdress"
          :label="$t('label.unitAdress')"
          :error="unitAdressError"
        />

        <div class="card-wrapper">
          <OurInput :label="$t('label.city')" :placeholder="townInformation.city" disabled />
          <OurInput :label="$t('label.state')" :placeholder="townInformation.stateProv" disabled />
          <OurInput :label="$t('label.country')" :placeholder="townInformation.country" disabled />
          <OurInput
            v-model="zipCode"
            :label="$t('label.ZIPCode')"
            :placeholder="$t('placeholder.ZIPCode')"
            :error="zipCodeError"
          />
        </div>
      </div>
    </OurCard>

    <div class="register-wrapper">
      <OurButton
        class="register-wrapper-button"
        variant="secondary"
        :text="$t('button.back')"
        size="lg"
        @click="onClickBackToProducts"
      />

      <OurButton
        class="register-wrapper-button"
        :text="$t('button.proceedToCheckout')"
        size="lg"
        @click="onClickNextStep"
      />
    </div>
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import ValidationService from "@/services/validate.service";
import { mapMutations, mapState } from "vuex";

const { phoneMaxLength, phoneMinLength } = ValidationService;

import OurIconStepper from "./components/OurIconStepper";
import Product from "./components/Product";
import { layout } from "@/configs/ourApp.config";

export default {
  name: "SignUpProducts",

  components: {
    Product,
    OurIconStepper,
  },

  data: () => ({
    preparedCountry: "US",
    score: "",
    strength: "",
    zipCode: "",
    form: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      company: "",
      serviceAdress: "",
      unitAdress: "",
    },
  }),

  validations: {
    form: {
      firstName: { required },
      lastName: { required },
      phone: { required, phoneMinLength, phoneMaxLength },
      email: { required, email },
      password: { required },
      serviceAdress: { required },
      unitAdress: { required },
    },
    zipCode: { required },
  },

  computed: {
    ...mapState(["auth"]),

    nameError() {
      const isDirty = this.$v.form.firstName.$dirty;
      const isFilled = this.$v.form.firstName.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    phoneError() {
      const isDirty = this.$v.form.phone.$dirty;
      const isFilled = this.$v.form.phone.required;
      const isMinLength = this.$v.form.phone.phoneMinLength;
      const isMaxLength = this.$v.form.phone.phoneMaxLength;

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

    passwordError() {
      const isDirty = this.$v.form.password.$dirty;
      const isFilled = this.$v.form.password.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    serviceAdressError() {
      const isDirty = this.$v.form.serviceAdress.$dirty;
      const isFilled = this.$v.form.serviceAdress.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    unitAdressError() {
      const isDirty = this.$v.form.unitAdress.$dirty;
      const isFilled = this.$v.form.unitAdress.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    zipCodeError() {
      const isDirty = this.$v.zipCode.$dirty;
      const isFilled = this.$v.zipCode.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    townInformation() {
      return {
        stateProv: this.auth.signUpData.stateProv,
        country: this.auth.signUpData.country,
        city: this.auth.signUpData.city,
      };
    },

    logoPath() {
      return layout.auth.logoPath;
    },

    contactUsRoute() {
      return { name: "ContactUs" };
    },
  },

  created() {
    this.prefillForm();
  },

  methods: {
    ...mapMutations(["SET_SIGN_UP_DATA"]),

    prefillForm() {
      this.form.firstName = this.auth.signUpData?.user?.firstName || "";
      this.form.lastName = this.auth.signUpData?.user?.lastName || "";
      this.form.email = this.auth.signUpData?.user?.email || "";
      this.form.phone = this.auth.signUpData?.user?.phone || "";
      this.form.password = this.auth.signUpData?.user?.password || "";
      this.form.company = this.auth.signUpData?.user?.company || "";
      this.form.serviceAdress = this.auth.signUpData?.user?.serviceAdress || "";
      this.form.unitAdress = this.auth.signUpData?.user?.unitAdress || "";
      this.zipCode = this.auth.signUpData?.zipCode || "";
    },

    onClickNextStep() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const signUpData = {
        ...this.auth.signUpData,
        zipCode: this.zipCode,
        user: this.form,
      };

      this.SET_SIGN_UP_DATA(signUpData);

      this.$router.push({ name: "SignUpPayment" });
    },

    onClickBackToProducts() {
      const signUpData = {
        ...this.auth.signUpData,
        zipCode: this.zipCode,
        user: this.form,
      };

      this.SET_SIGN_UP_DATA(signUpData);

      this.$router.push({ name: "SignUpProducts" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.card {
  @apply w-full max-w-2xl !important;
  @apply space-y-8;

  &-title {
    @apply text-2lg font-bold text-base-dark;
  }

  &-block {
    @apply mt-6 space-y-6 !important;
  }

  &-wrapper {
    @apply flex space-x-6;
  }

  &-input {
    @apply w-full;
  }

  &-separator {
    @apply border-t border-dashed border-gray-300;
  }
}

.register {
  @apply w-full max-w-full;

  &-title {
    @apply text-center text-4xl font-bold text-base-dark;
    @apply mb-2 mt-8;
  }

  &-logo {
    @apply justify-center;

    &::v-deep {
      .logo {
        @apply w-[14.6875rem];
      }
    }
  }

  &-help {
    &-title {
      @apply text-lg font-normal text-gray-500;
    }

    &-wrapper {
      @apply flex items-center justify-center;
      @apply mb-8;
    }

    &-link {
      @apply pt-px pl-1.5;
    }
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

.card-input::v-deep {
  .phone {
    .vti__dropdown {
      @apply p-0 !important;
    }
  }
}
.password-wrapper {
  @apply w-full;
}
</style>
