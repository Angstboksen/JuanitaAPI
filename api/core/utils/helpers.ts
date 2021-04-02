export const validateLimit = (array: any[], limit: any) => {
  if (limit !== undefined && +limit > 0) {
    return array.slice(0, +limit);
  }
  return array;
};
