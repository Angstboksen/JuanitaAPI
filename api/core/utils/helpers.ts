export const validateLimit = (limit: any) => {
  if (limit !== undefined && +limit > 0) {
    return true;
  }
  return false;
};
