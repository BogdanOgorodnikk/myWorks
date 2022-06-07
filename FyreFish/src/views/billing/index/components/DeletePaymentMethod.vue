<template>
  <div>
    <OurConfirmModal
      v-model="isModalVisible"
      class="modal-confirm-delete"
      width="sm"
      :title="$t('title.deletePaymentMethod')"
      :action-button-text="$t('button.deletePayment')"
      @actionConfirmed="onClickDeletePayment"
      @closed="closeModal"
    >
      <div class="sure-to-delete">
        {{ $t("validation.areYouSureToDelete") }}
      </div>
    </OurConfirmModal>
    <OurCard class="card">
      <div class="card-title">{{ $t("title.managePaymentMethods") }}</div>
      <PaymentMethod
        v-for="option in paymentMethodOptions"
        :key="option.cardNumber"
        v-model="paymentMethod"
        :option="option"
        class="card-payment-methods"
      />
    </OurCard>
    <div class="register-wrapper">
      <OurButton
        class="register-wrapper-button"
        variant="secondary"
        :text="$t('button.back')"
        size="lg"
        @click="onClickBack"
      />
      <OurButton
        class="register-wrapper-button"
        :text="$t('button.deletePayment')"
        size="lg"
        @click="onClickShowModalConfirm"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import PaymentMethod from "./PaymentMethod";
import { isEmpty } from "lodash";

export default {
  name: "DeletePaymentMethod",
  components: {
    PaymentMethod,
  },
  data() {
    return {
      paymentMethod: {},
      isModalVisible: false,
    };
  },
  computed: {
    ...mapState("billing", ["paymentMethodOptions"]),
  },
  methods: {
    ...mapMutations("billing", ["DELETE_PAYMENT_METHOD"]),
    onClickBack() {
      this.$emit("paymentCancelled");
    },
    onClickShowModalConfirm() {
      if (isEmpty(this.paymentMethod)) return;
      this.isModalVisible = true;
    },
    closeConfirmModal() {
      this.isModalVisible = false;
    },
    onClickDeletePayment() {
      this.DELETE_PAYMENT_METHOD(this.paymentMethod);
      this.closeConfirmModal();
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.card {
  &-title {
    @apply text-2lg font-bold text-base-dark;
  }
}
.register {
  &-wrapper {
    @apply flex justify-between;
    @apply max-w-2xl;
    @apply mx-auto px-6;

    &-button {
      @apply mt-6 w-auto !important;
    }
  }
}
.sure-to-delete {
  @apply text-center text-2xl font-bold text-base-deep-red;
}
</style>
