<template>
  <OurPage width="wide">
    <PageTitle />

    <div class="support-wrapper">
      <div class="support-wrapper-panel">
        <OurCard>
          <div class="card-title">{{ $t("page.support.contactUs") }}</div>
          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("page.support.phone") }}</div>
            <div class="card-wrapper-description">+1 877 583 0496</div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("page.support.inquiries") }}</div>
            <div class="card-wrapper-link">info@redbison.us</div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("page.support.office") }}</div>
            <div class="card-wrapper-description">Red Bison Technology Group, LLC</div>
          </div>

          <div class="card-wrapper">
            <div />
            <div class="card-wrapper-description">P.O. Box 1358</div>
          </div>

          <div class="card-wrapper">
            <div />
            <div class="card-wrapper-description">Mercer Island, WA 98040</div>
          </div>
        </OurCard>
      </div>

      <OurCard class="card-form">
        <div class="card-title">{{ $t("page.support.contactSupport") }}</div>

        <div class="card-wrapper">
          <div class="card-wrapper-title">{{ $t("page.support.from") }}</div>
          <div v-if="isPropertyManager" class="card-wrapper-description">Mike Rapelle</div>
          <div v-else class="card-wrapper-description">Lynn Martin</div>
        </div>

        <div class="card-wrapper">
          <div />
          <div v-if="isPropertyManager" class="card-wrapper-link">pmanager@maildrop.cc</div>
          <div v-else class="card-wrapper-link">lmartin@maildrop.cc</div>
        </div>

        <div class="card-wrapper">
          <div />
          <div v-if="isPropertyManager" class="card-wrapper-description">+1 303 508 7654</div>
          <div v-else class="card-wrapper-description">+1 303 456 7890</div>
        </div>

        <OurInput class="card-input" :placeholder="$t('placeholder.contactSupport')" size="lg" />

        <div class="card-button">
          <OurButton class="m-auto w-80" text="Submit" />
        </div>
      </OurCard>
    </div>
  </OurPage>
</template>

<script>
import { mapGetters } from "vuex";
import PageTitle from "@/components/PageTitle";

export default {
  name: "Support",
  components: {
    PageTitle,
  },

  computed: {
    ...mapGetters(["isPropertyManager"]),
  },
};
</script>

<style lang="postcss" scoped>
.support {
  &-wrapper {
    @apply grid grid-cols-3 gap-8 py-6;

    &-panel {
      @apply col-span-1 w-96;
    }
  }
}

.card {
  @apply space-y-2;

  &-title {
    @apply pb-4 text-2lg font-bold text-base-dark;
  }

  &-button {
    @apply grid justify-items-end;
  }

  &-input {
    @apply py-2;
  }

  &-form {
    @apply col-span-2;
  }

  &-wrapper {
    @apply flex w-80 justify-between;

    &-title {
      @apply w-1/4 text-base font-bold text-base-dark;
    }

    &-description {
      @apply w-3/4 text-base font-normal text-gray-500;
    }

    &-link {
      @apply w-3/4 text-base font-medium text-blue-500 underline;
    }
  }
}
</style>
