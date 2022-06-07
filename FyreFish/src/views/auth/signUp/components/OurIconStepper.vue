<template>
  <div class="stepper">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="step-wrapper"
      :class="isActiveStep(step.pageName)"
    >
      <OurSvgIcon :name="step.iconName" size="xl" class="step-icon" color="gray" />

      <div class="step-title">
        <span class="step-title-count">{{ index + 1 }}</span> {{ step.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OurIconStepper",

  data() {
    return {
      steps: [
        {
          iconName: "Marker1",
          title: this.$t("page.signUp.identifyLocation"),
          pageName: "SignUpBuildings",
        },
        {
          iconName: "Cart1",
          title: this.$t("page.signUp.selectProducts"),
          pageName: "SignUpProducts",
        },
        {
          iconName: "Bullet-list",
          title: this.$t("page.signUp.provideInformation"),
          pageName: "SignUpUserInformation",
        },
        {
          iconName: "Credit-card",
          title: this.$t("page.signUp.paymentDetails"),
          pageName: "SignUpPayment",
        },
      ],
    };
  },

  mounted() {
    this.isActiveStep();
  },

  methods: {
    isActiveStep(stepPageName) {
      if (this.$route.name === stepPageName) {
        return "step-active";
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.stepper {
  @apply flex justify-between;
  @apply border-b border-dashed border-gray-300;
  @apply pb-8;

  .step {
    &-active {
      .step-icon {
        &::v-deep g [fill] {
          @apply text-base-dark;
        }
      }

      .step-title {
        @apply text-base-dark;
        @apply border-b border-dashed border-base-dark;
      }
    }

    &-wrapper {
      @apply text-center;
    }

    &-icon {
      @apply mb-0.5;

      &::v-deep g [fill] {
        @apply opacity-100;
      }
    }

    &-title {
      @apply whitespace-nowrap text-xs font-normal text-gray-400;

      &-count {
        &::after {
          content: ".";
        }
      }
    }
  }
}

.step-icon::v-deep {
  g {
    #Rectangle-59,
    #Rectangle-59-Copy {
      @apply fill-current text-white opacity-80;
    }
  }
}
</style>
