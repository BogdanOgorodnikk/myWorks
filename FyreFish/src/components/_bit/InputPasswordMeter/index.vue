<template>
  <div v-show="password.length">
    <div class="password-reliability">
      <div class="password-reliability-item" />
      <div class="password-reliability-item" />
      <div class="password-reliability-item" />
      <div class="password-reliability-item" />
      <div class="password-reliability-item" />
    </div>

    <password-meter :password="password" class="password-meter" @score="onScore" />

    <div class="password-wrapper">
      <div class="password-reliability-stage">
        {{ passwordReliability }}
      </div>
    </div>
  </div>
</template>

<script>
import passwordMeter from "vue-simple-password-meter";

export default {
  name: "PasswordMeter",

  components: {
    passwordMeter,
  },

  props: {
    password: {
      type: String,
      default: "",
    },
  },

  data: () => ({
    score: "",
    strength: "",
  }),

  computed: {
    passwordReliability() {
      const reliabilityStage = [
        this.$t("component.ourPasswordMeter.reliability.weak"),
        this.$t("component.ourPasswordMeter.reliability.guessable"),
        this.$t("component.ourPasswordMeter.reliability.safe"),
        this.$t("component.ourPasswordMeter.reliability.secure"),
        this.$t("component.ourPasswordMeter.reliability.strong"),
      ];

      return reliabilityStage[this.score];
    },
  },

  watch: {
    score: "onChangeScore",
  },

  methods: {
    onChangeScore() {
      const reliabilityItems = document.querySelectorAll(".password-reliability-item");
      const defaultPasswordItemClass = "password-reliability-item";
      const passwordColorsClass = [
        "password-risky",
        "password-guessable",
        "password-weak",
        "password-safe",
        "password-secure",
      ];

      for (let i = reliabilityItems.length - 1; i > this.score; i--) {
        reliabilityItems[i].classList = defaultPasswordItemClass;
      }

      for (let i = 0; i <= this.score; i++) {
        reliabilityItems[i].classList = `${defaultPasswordItemClass}
          ${passwordColorsClass[this.score]}`;
      }
    },

    onScore({ score, strength }) {
      this.strength = strength;
      this.score = score;
    },
  },
};
</script>

<style lang="postcss" scoped>
.password {
  &-wrapper {
    @apply flex justify-between;
    @apply mt-1 px-4;
  }

  &-info {
    @apply text-xs font-normal text-gray-500;
    @apply border-b border-dashed border-gray-500;
    @apply cursor-pointer;
  }

  &-reliability {
    @apply flex;
    @apply mt-2 space-x-1 px-4;

    &-item {
      @apply w-full py-0.5;
      @apply rounded-lg bg-gray-200;
    }

    &-stage {
      @apply text-xs font-normal text-gray-500;
    }
  }

  &-meter {
    @apply m-0 h-0 p-0 opacity-0;
  }

  &-risky {
    @apply bg-red-500;
  }

  &-guessable {
    @apply bg-yellow-500;
  }

  &-weak {
    @apply bg-yellow-300;
  }

  &-safe {
    @apply bg-green-300;
  }

  &-secure {
    @apply bg-green-500;
  }
}
</style>
