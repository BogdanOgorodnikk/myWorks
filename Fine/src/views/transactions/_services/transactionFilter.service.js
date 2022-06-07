export function checkSuitabilityFilters(filters, transaction) {
  let isFiltered = true;

  if (filters.bankAccountId.length && isFiltered) {
    const similarBank = filters.bankAccountId.find((item) => item === transaction.bankAccount?.id);

    isFiltered = !!similarBank;
  }

  if (filters.categoryId.length && isFiltered) {
    const similarCategory = filters.categoryId.find((item) => item === transaction.category?.id);

    isFiltered = !!similarCategory;
  }

  if (filters.categoryType.length && isFiltered) {
    const similarCategoryType = filters.categoryType.find(
      (item) => item === transaction.category?.type
    );

    isFiltered = !!similarCategoryType;
  }

  if (filters.counterpartyId.length && isFiltered) {
    const similarCounterparty = filters.counterpartyId.find(
      (item) => item === transaction.counterparty?.id
    );

    isFiltered = !!similarCounterparty;
  }

  if (filters.categoryId.length && isFiltered) {
    const similarProject = filters.projectId.find((item) => item === transaction.project?.id);

    isFiltered = !!similarProject;
  }

  if (filters.tagId.length && isFiltered) {
    let similarTags = [];

    transaction.tags.forEach((tag) => {
      const similarTag = filters.tagId.find((item) => item === tag?.id);

      if (similarTag) {
        similarTags.push(tag.id);
      }
    });

    isFiltered = !!similarTags.length;
  }

  if (filters.sum.from && filters.sum.to && isFiltered) {
    isFiltered = transaction.sum >= filters.sum.from && transaction.sum <= filters.sum.to;
  } else if (filters.sum.from && isFiltered) {
    isFiltered = transaction.sum >= filters.sum.from;
  } else if (filters.sum.to && isFiltered) {
    isFiltered = transaction.sum <= filters.sum.to;
  }

  if (filters.accrualConfirmed !== null && isFiltered) {
    isFiltered = filters.accrualConfirmed === transaction.accrualConfirmed;
  }

  if (filters.paymentConfirmed !== null && isFiltered) {
    isFiltered = filters.paymentConfirmed === transaction.paymentConfirmed;
  }

  return isFiltered;
}

export default {
  checkSuitabilityFilters,
};
