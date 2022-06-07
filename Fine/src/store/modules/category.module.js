import idb from "@/plugins/vue-idb-keyval";
import i18n from "@/plugins/vue-i18n";
import router from "@/router";
import {
  getCategories,
  getCategory,
  getCategoryTypes,
  getCategoryActivities,
  addCategory,
  updateCategory,
  updateCategorySort,
  deleteCategory,
  DEFAULT_CATEGORY_CODE,
} from "@/api/category";
import DataService from "@/services/data.service";
import {
  joinChildrenWithParent,
  isSubCategory,
  prepareNestedList,
  prepareNameChainNestedCategories,
} from "@/views/setting/category/_services/nestedCategories.service";

export default {
  namespaced: true,

  state: {
    category: null,
    categories: [],
    categoryTypes: [],
    categoryActivities: [],
  },

  getters: {
    categories(state) {
      const categoriesValues = state.categories;

      let categoriesOptions = [];

      if (categoriesValues.length) {
        categoriesOptions = categoriesValues.map((category) => ({
          id: category.id,
          label: category.name,
        }));
      }

      return categoriesOptions;
    },

    nestedCategoriesForSelect(state, getters) {
      return (categoryType) => {
        const filteredCategories = getters.filteredCategoriesByType(categoryType);

        const preparedCategories = prepareNestedList(filteredCategories);

        let withGroupCategories = [];
        let withoutGroupCategories = {
          category: i18n.t("label.withoutGroup"),
          subCategories: [],
        };

        preparedCategories.forEach((category) => {
          let prepareCategory = {
            category: "",
            subCategories: [],
          };

          if (category.length) {
            category.forEach((item) => {
              if (item?.category) {
                prepareCategory.category = item.category;
              } else {
                prepareCategory.subCategories.push(item);
              }
            });

            withGroupCategories.push(prepareCategory);
          } else {
            withoutGroupCategories.subCategories.push(category);
          }
        });

        return [withoutGroupCategories, ...withGroupCategories];
      };
    },

    defaultCategories(state) {
      const expense = state.categories.find((item) => item.code === DEFAULT_CATEGORY_CODE.expense);

      const income = state.categories.find((item) => item.code === DEFAULT_CATEGORY_CODE.income);

      const transfer = state.categories.find(
        (item) => item.code === DEFAULT_CATEGORY_CODE.transfer
      );

      return {
        expense: {
          label: expense.name,
          code: expense.code,
          id: expense.id,
        },
        income: {
          label: income.name,
          code: income.code,
          id: income.id,
        },
        transfer: {
          label: transfer.name,
          code: transfer.code,
          id: transfer.id,
        },
      };
    },

    filteredCategoriesByType(state) {
      const categories = [...state.categories];

      const subCategories = {
        income: "deposit",
        expense: "withdrawal",
      };

      const filters = {
        income: {},
        expense: {},
        transfer: {},
      };

      return (mainCategory) => {
        if (!categories || isSubCategory(subCategories, mainCategory)) {
          return [];
        }

        const mainCategories = categories.filter((item) => item.type === mainCategory);
        const preparedMainCategories = mainCategories.map((item) => ({
          ...item,
          isHiddenAction: !!item.code,
          isDisabledNesting: !!item.code,
        }));
        const subCategory = subCategories[mainCategory];

        const subFilteredCategories = subCategory
          ? categories.filter((item) => item.type === subCategory)
          : [];

        const mainFiltered = preparedMainCategories.filter((item) => {
          return Object.keys(filters[mainCategory]).every((key) =>
            String(item[key]).toLowerCase().includes(filters[mainCategory][key].toLowerCase())
          );
        });

        const subFiltered = subFilteredCategories.filter((item) => {
          return Object.keys(filters[mainCategory]).every((key) =>
            String(item[key]).toLowerCase().includes(filters[mainCategory][key].toLowerCase())
          );
        });

        let filtered = [...mainFiltered, ...subFiltered];

        // sort data by sort value
        filtered.sort(DataService.compareValues("sort"));

        if (!filtered.length) {
          filtered = [{ name: "", activityName: "" }];
        }

        filtered = joinChildrenWithParent(filtered);

        return filtered;
      };
    },

    categoriesByType(state) {
      return (transactionType) => {
        const filteredCategories = state.categories.filter((item) => {
          return item.type === transactionType;
        });

        return filteredCategories.map((item) => ({
          id: item.id,
          label: item.name,
          code: item.code,
        }));
      };
    },

    nameChainNestedCategories(state) {
      return (categoriesId) => {
        return prepareNameChainNestedCategories(state.categories, categoriesId);
      };
    },
  },

  mutations: {
    SET_CATEGORY(state, category) {
      state.category = category;
    },

    DELETE_CATEGORY(state, categoryId) {
      state.categories = state.categories.filter((category) => category.id !== categoryId);
    },

    SET_CATEGORIES(state, categories) {
      if (categories.length) {
        state.categories =
          categories.map((category) => {
            return {
              ...category,
              activityName: category.code,
              children: [],
            };
          }) || [];
      } else {
        state.categories.push({ ...categories, activityName: categories.code, children: [] });
      }
    },

    UPDATE_CATEGORY(state, category) {
      state.categories = DataService.updateArray(state.categories, [
        { ...category, activityName: category.code, children: [] },
      ]);
    },

    SET_CATEGORY_TYPES(state, categoryTypes) {
      const categoryTypesLabelLocaleCode = {
        expense: "label.cashFlowTypes.expense",
        income: "label.cashFlowTypes.income",
        transfer: "label.cashFlowTypes.transfer",
        deposit: "label.cashFlowTypes.deposit",
        withdrawal: "label.cashFlowTypes.withdrawal",
      };

      const categoryTypesInfoLocaleCode = {
        expense: "description.category.type.expense",
        income: "description.category.type.income",
        transfer: "description.category.type.transfer",
        deposit: "description.category.type.deposit",
        withdrawal: "description.category.type.withdrawal",
      };

      state.categoryTypes =
        categoryTypes.map((item) => {
          return {
            code: item,
            label: i18n.t(categoryTypesLabelLocaleCode[item]),
            info: i18n.t(categoryTypesInfoLocaleCode[item]),
          };
        }) || [];
    },

    SET_CATEGORY_ACTIVITIES(state, categoryActivities) {
      const categoryActivitiesLabelLocaleCode = {
        operating: "label.cashFlowActivities.operating",
        financial: "label.cashFlowActivities.financial",
        investment: "label.cashFlowActivities.investment",
      };

      const categoryActivitiesInfoLocaleCode = {
        operating: "description.category.activity.operating",
        financial: "description.category.activity.financial",
        investment: "description.category.activity.investment",
      };

      state.categoryActivities =
        categoryActivities.map((item) => {
          return {
            code: item,
            label: i18n.t(categoryActivitiesLabelLocaleCode[item]),
            info: i18n.t(categoryActivitiesInfoLocaleCode[item]),
          };
        }) || [];
    },
  },

  actions: {
    async getCategory(context, categoryId) {
      const response = await getCategory(categoryId);

      context.commit("SET_CATEGORY", response);
    },

    async getCategories(context) {
      if (context.state.categories.length) return;

      const idbCategories = await idb.get("categories");
      const isPresentIdbData = !!idbCategories?.length;

      if (isPresentIdbData) {
        context.commit("SET_CATEGORIES", idbCategories);
      }

      const response = await getCategories(!isPresentIdbData);

      context.commit("SET_CATEGORIES", response);

      await idb.set("categories", response);
    },

    async getCategoryTypes(context) {
      const response = await getCategoryTypes();

      context.commit("SET_CATEGORY_TYPES", response);
    },

    async getCategoryActivities(context) {
      const response = await getCategoryActivities();

      context.commit("SET_CATEGORY_ACTIVITIES", response);
    },

    async addCategory(context, category) {
      const response = await addCategory(category);

      context.commit("SET_CATEGORIES", response);

      await idb.set("categories", response);

      await router.push({ name: "CategoryList" });
    },

    async updateCategory(context, category) {
      const response = await updateCategory(category);

      context.commit("UPDATE_CATEGORY", response);

      await idb.set("categories", response);

      await router.push({ name: "CategoryList" });
    },

    async updateCategorySort(context, categories) {
      await updateCategorySort(categories);
    },

    async deleteCategory(context, { categoryId, currentRoute, delaySuccessNotify = false }) {
      await deleteCategory(categoryId, delaySuccessNotify);

      context.commit("DELETE_CATEGORY", categoryId);

      await idb.set("categories", context.state.categories);

      if (currentRoute !== "CategoryList") {
        await router.push({ name: "CategoryList" });
      }
    },
  },
};
