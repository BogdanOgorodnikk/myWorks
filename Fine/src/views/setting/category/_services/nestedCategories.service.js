export function isSubCategory(subCategories, categoryCode) {
  return !!Object.values(subCategories).includes(categoryCode);
}

export function joinChildrenWithParent(categories) {
  const childrenCategories = categories.map((item) => ({
    parentId: item.parent?.id,
    ...item,
  }));

  const filteredChildrenCategories = childrenCategories.filter((item) => {
    return item.parentId !== undefined;
  });

  const categoriesWithChildren = categories.map((item) => {
    filteredChildrenCategories.forEach((categories) => {
      const prepareCategory = {
        activity: categories.activity,
        activityName: categories.activityName,
        children: categories.children,
        createdAt: categories.createdAt,
        description: categories.description,
        id: categories.id,
        name: categories.name,
        parent: categories.parent,
        sort: categories.sort,
        type: categories.type,
        updatedAt: categories.updatedAt,
        isHiddenAction: !!categories.code,
        isDisabledNesting: !!categories.code,
      };

      if (categories.parentId === item?.id) {
        let isSameChildren = false;

        item.children.forEach((child) => {
          if (child.name === prepareCategory.name) isSameChildren = true;
        });

        if (!isSameChildren) item.children.push(prepareCategory);
      }
    });

    return item;
  });

  const prepareCategoriesWithChildren = categoriesWithChildren.map((item) => {
    filteredChildrenCategories.forEach((categories) => {
      if (categories.id === item?.id) {
        item = null;
      }
    });

    return item;
  });

  const filteredPrepareCategoriesWithChildren = prepareCategoriesWithChildren.filter((item) => {
    return item !== null;
  });

  return filteredPrepareCategoriesWithChildren;
}

export function prepareNestedList(categories, level) {
  return categories.map((category) => {
    let subCategories;
    let nestingLevel = level || 0;

    if (category.children?.length) {
      nestingLevel += 1;
      subCategories = prepareNestedList(category.children, nestingLevel);
    } else {
      return {
        id: category.id,
        label: category.name,
        level: nestingLevel,
      };
    }

    let mainCategory = [{ category: category.name, level: nestingLevel }];

    if (nestingLevel > 1) {
      mainCategory = [{ label: category.name, level: nestingLevel, isSubGroup: true }];
    }

    return mainCategory.concat(subCategories.flat(1));
  });
}

export function prepareNameChainNestedCategories(categories, categoryId) {
  const nestedCategory = categories.find((category) => category.id === categoryId);

  let nestedCategoryName = nestedCategory?.name;

  if (nestedCategory?.parent) {
    const parentCategoryName = prepareNameChainNestedCategories(
      categories,
      nestedCategory.parent?.id
    );

    nestedCategoryName = `${parentCategoryName} / ${nestedCategoryName}`;
  }

  return nestedCategoryName;
}

export default {
  isSubCategory,
  prepareNestedList,
  joinChildrenWithParent,
  prepareNameChainNestedCategories,
};
