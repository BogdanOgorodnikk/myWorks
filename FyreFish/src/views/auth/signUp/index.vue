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

      <div class="card-title">{{ $t("page.signUp.identifyLocation") }}</div>

      <div class="search-wrapper">
        <OurInput
          v-model="form.searchedBuilding"
          class="search-input"
          :label="$t('label.searchBuilding')"
          :placeholder="$t('placeholder.searchBuilding')"
          size="lg"
          @keyupEnter="onKeyupSearchBuilding"
        />

        <OurButton
          :text="$t('button.search')"
          class="search-button"
          @click="onClickSearchBuilding"
        />
      </div>

      <div v-if="buildings.length" class="building">
        <Building
          v-for="building in buildings"
          :key="building.id"
          v-model="form.id"
          :building="building"
        />
      </div>

      <div v-else>{{ $t("page.signUp.notFindBuilding") }}</div>
    </OurCard>

    <div class="register-wrapper">
      <OurButton
        class="register-wrapper-button"
        variant="secondary"
        :text="$t('button.goToLogin')"
        size="lg"
        @click="onClickBackToLogin"
      />

      <OurButton
        class="register-wrapper-button"
        :text="$t('button.next')"
        :disabled="!form.id"
        size="lg"
        @click="onClickNextStep"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

import OurIconStepper from "./components/OurIconStepper";
import Building from "./components/Building";
import { layout } from "@/configs/ourApp.config";

export default {
  name: "SignUpBuildings",

  components: {
    Building,
    OurIconStepper,
  },

  data() {
    return {
      form: {
        searchedBuilding: "",
        id: "",
      },
    };
  },

  computed: {
    ...mapState("building", ["buildings"]),
    ...mapState(["auth"]),

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
    ...mapActions("building", ["getPublicBuildings"]),

    ...mapMutations(["SET_SIGN_UP_DATA"]),

    prefillForm() {
      this.form = {
        searchedBuilding: this.auth.signUpData.searchedBuilding || "",
        id: this.auth.signUpData.id || "",
      };
    },

    async searchBuilding() {
      await this.getPublicBuildings(this.form.searchedBuilding);

      this.form.id = "";
    },

    async onClickSearchBuilding() {
      await this.searchBuilding();
    },

    async onKeyupSearchBuilding() {
      await this.searchBuilding();
    },

    onClickNextStep() {
      if (!this.form.id) {
        return;
      }

      const build = this.buildings.find((build) => build.id === Number(this.form.id));

      const signUpData = {
        id: this.form.id,
        searchedBuilding: this.form.searchedBuilding,
        stateProv: build.stateProv,
        country: build.country,
        city: build.city,
        zipCode: build.postalCode,
      };

      this.SET_SIGN_UP_DATA(signUpData);

      this.$router.push({ name: "SignUpProducts" });
    },

    onClickBackToLogin() {
      this.$router.push({ name: "Login" });
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
}

.search {
  &-wrapper {
    @apply flex;
    @apply w-full;
    @apply relative mt-6 !important;
  }

  &-input {
    @apply flex-1;

    &::v-deep {
      .input {
        @apply pr-24;
      }
    }
  }

  &-button {
    @apply absolute top-0 right-0;
    @apply mt-0 h-full w-auto ring-0 !important;
    @apply rounded-l-none;
    @apply border-base-deep-red bg-base-deep-red bg-opacity-15;

    &::v-deep {
      .text-wrap {
        @apply text-white;
      }
    }
  }
}

.building {
  @apply space-y-6 !important;
}

.register {
  @apply w-full max-w-full;

  &-title {
    @apply text-center text-4xl font-bold text-base-dark;
    @apply mb-2 mt-8;
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

  &-logo {
    @apply mb-10 justify-center;

    &::v-deep {
      .logo {
        @apply w-[14.6875rem];
      }
    }
  }
}
</style>
