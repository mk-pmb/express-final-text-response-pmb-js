// -*- coding: utf-8, tab-width: 2 -*-

import isFunc from 'is-fn';
import isStr from 'is-string';

import installApi from './installApi.mjs';


const api = {};


const EX = function simpleCannedFinalResponse(ftr, code, text, custom) {
  if (!(isFunc(ftr) && ftr.simpleCanned)) {
    throw new TypeError('Argument #1 must be an FTR function.');
  }
  const f = function cannedReply(req) { ftr(req, f.opt); };
  f.opt = { ftr, type: 'text', ...custom, code, text };
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


function throwable(sc, arg) {
  if (arg && isStr(arg)) { return throwable(sc, { explain: arg }); }
  const opt = { ...sc.opt, ...arg };
  let msg = opt.text;
  delete opt.text;
  if (opt.explain) { msg += ': ' + opt.explain; }
  delete opt.explain;
  delete opt.ftr;
  delete opt.type;
  return Object.assign(new Error(msg), throwable.defaultProps, opt);
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
