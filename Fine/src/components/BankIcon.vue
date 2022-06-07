<template>
  <img class="icon" :src="iconLink" />
</template>

<script>
export default {
  props: {
    bank: {
      type: String,
      default: "",
    },
  },

  computed: {
    iconLink() {
      const allBanks = {
        monobankPersonal: "monobank.jpg",
        privat24Personal: "privatbank.jpg",
        privat24Business: "privatbankbusiness.jpg",
      };

      const selectedBank = allBanks[this.bank];

      return require(`@/assets/images/logos/banks/${selectedBank}`);
    },
  },
};
</script>

<style lang="postcss" scoped>
.icon {
  @apply inline-block rounded-lg shadow-md;
  @apply h-10 w-10;
}
</style>
