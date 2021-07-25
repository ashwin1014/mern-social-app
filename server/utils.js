/* eslint-disable max-len */
const omitValue = (key, obj) => {
  const { [key]: _, ...rest } = obj;
  return rest;
};

const isEmpty = (obj) => [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

export { omitValue, isEmpty };
