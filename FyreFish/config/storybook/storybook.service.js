export const generateArgTypesSettingsForSlots = (slotNames) => {
  const newArgTypes = {};

  slotNames.forEach((slotName) => {
    newArgTypes[slotName] = { control: { type: "text" } };
  });

  return newArgTypes;
};

export const camelToKebab = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .join("-")
    .toLowerCase();
};

// TODO: This metod can get slot names dynamically when w can find solution to get argTypes in story.
// export const generateArgTypesSettingsForSlots = (argTypes) => {
//   const newArgTypes = {};
//
//   const slotNames =
//     Object.values(argTypes)
//       .filter((item) => item.table?.category === "slots")
//       .map((item) => item.name) || [];
//
//   slotNames.forEach((slotName) => {
//     newArgTypes[slotName] = { control: { type: "text" } };
//   });
// };

export default {
  generateArgTypesSettingsForSlots,
  camelToKebab,
};
