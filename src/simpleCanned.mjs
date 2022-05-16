// -*- coding: utf-8, tab-width: 2 -*-

import installApi from './installApi.mjs';


const api = {};


const EX = function simpleCannedFinalResponse(ftr, code, text, custom) {
  const f = function cannedReply(req) { ftr(req, f.opt); };
  f.opt = { type: 'text', ...custom, code, text };
  installApi(f, api);
  return f;
};


function explain(sc, detail) {
  let { opt } = sc;
  const {
    ftr,
    code,
    text,
    getLike,
  } = opt;
  (function maybeExtendGetLike() {
    const t = (getLike || false).text;
    if (!t) { return; }
    opt = { ...opt, getLike: { ...getLike, text: t + ': ' + detail } };
  }());
  return EX(ftr, code, text + ': ' + detail, opt);
}


function throwable(sc) {
  const { opt } = sc;
  const {
    text,
    ...other
  } = opt;
  delete other.type;
  return Object.assign(new Error(text), throwable.defaultProps, other);
}

throwable.defaultProps = {
  name: 'SimpleCannedThrowableError',
  code: 500,
  shouldBeTraced: false,
};


Object.assign(api, {
  explain,
  throwable,
});


export default EX;
