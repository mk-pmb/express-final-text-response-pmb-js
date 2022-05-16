// -*- coding: utf-8, tab-width: 2 -*-

const EX = function installApi(f, api) {
  // eslint-disable-next-line no-param-reassign
  Object.entries(api).forEach(([k, v]) => { f[k] = v.bind(null, f); });
  return f;
};

export default EX;
