export default class DataServiceDefault {
  compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      const isPropExistInObjA = Object.prototype.hasOwnProperty.call(a, key);
      const isPropExistInObjB = Object.prototype.hasOwnProperty.call(b, key);

      if (!isPropExistInObjA || !isPropExistInObjB) {
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
      let comparison = 0;

      if (!varA) return 1;

      if (!varB) return -1;

      if (varA > varB) {
        comparison = 1;
      }

      if (varA < varB) {
        comparison = -1;
      }

      return order === "desc" ? comparison * -1 : comparison;
    };
  }

  updateArray(oldArray, newArray) {
    const preparedNewArray = new Map(newArray.map((item) => [item.id, item]));

    return oldArray.map((item) => {
      return preparedNewArray.has(item.id) ? preparedNewArray.get(item.id) : item;
    });
  }
}
