<template>
  <div>
    <div class="money-details-dropdown">
      <div class="money-details-dropdown-title" @click="onClickShowDescription">
        {{ title }}

        <OurSvgIcon
          name="Angle-down"
          size="xs"
          class="money-details-dropdown-title-icon"
          :class="dropdownIconClass"
        />
      </div>

      <OurMoney
        class="money-details-dropdown-sum"
        size="lg"
        :item="plannedMoney.generalAmount"
        currency-symbol-align="left"
        :integer="!isShownCents"
      />
    </div>

    <transition name="money-details-dropdown">
      <div class="money-details-dropdown">
        <div class="money-details-dropdown-description">
          {{ descriptionTitle }}
        </div>

        <div v-if="isShownDescription" class="money-details-dropdown-block">
          <template v-for="(money, index) in plannedMoney.money">
            <OurMoney
              v-if="money.sum"
              :key="index"
              class="money-details-dropdown-description-sum"
              size="lg"
              :item="money"
              currency-symbol-align="left"
              :integer="!isShownCents"
            />
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  props: {
    title: {
      type: String,
      default: "",
    },

    descriptionTitle: {
      type: String,
      default: "",
    },

    plannedMoney: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    isShownDescription: false,
    isTransformedIcon: false,
  }),

  computed: {
    ...mapState("settings", ["settings"]),

    ...mapGetters("settings", ["isShownCents"]),

    dropdownIconClass() {
      return this.isTransformedIcon ? "money-details-dropdown-title-icon-transform" : "";
    },
  },

  methods: {
    onClickShowDescription() {
      this.isShownDescription = !this.isShownDescription;
      this.isTransformedIcon = !this.isTransformedIcon;
    },
  },
};
</script>

<style lang="postcss" scoped>
.money-details-dropdown-enter-active,
.money-details-dropdown-leave-active {
  @apply transition-all duration-150 ease-out;
  @apply opacity-100;
}
.money-details-dropdown-enter,
.money-details-dropdown-leave-to {
  @apply opacity-0;
}

.money-details-dropdown {
  @apply flex justify-between;
  @apply mt-2;

  &-title {
    @apply flex cursor-pointer items-center;
    @apply text-base font-normal text-gray-400;

    &-icon {
      @apply transition-all duration-300;
      @apply block;
      @apply ml-1 mt-0.5;

      &-transform {
        @apply rotate-180 transform;
      }

      &::v-deep g [fill] {
        @apply fill-current text-gray-400;
      }
    }
  }

  &-sum {
    &::v-deep {
      .money-block {
        @apply font-normal text-white;

        .penny {
          @apply text-sm;
        }
      }
    }
  }

  &-description {
    @apply text-sm font-normal text-gray-500;
    @apply w-6/12;

    &-sum {
      @apply mb-2;

      &:last-child {
        @apply mb-0;
      }

      &::v-deep {
        .money-block {
          @apply font-normal text-gray-400;

          .penny {
            @apply text-sm;
          }
        }
      }
    }
  }

  &-block {
    @apply text-right;
    @apply mb-2;
  }
}
</style>
