/* eslint-disable import/prefer-default-export */
const omitValue = (key, obj) => {
  const { [key]: _, ...rest } = obj;
  return rest;
};

export { omitValue };
