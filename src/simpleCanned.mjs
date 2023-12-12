// -*- coding: utf-8, tab-width: 2 -*-

import isFunc from 'is-fn';
import isStr from 'is-string';

import installApi from './installApi.mjs';


const api = {};

function orf(x) { return x || false; }


const EX = function simpleCannedFinalResponse(ftr, code, text, custom) {
  if (!(isFunc(ftr) && ftr.simpleCanned)) {
    throw new TypeError('Argument #1 must be an FTR function.');
  }
  const f = function cannedReply(req) { ftr(req, f.opt); };
  f.opt = { ftr, type: 'plain', ...custom, code, text };
  installApi(f, api);
  return f;
};


function err2str(e) { return String((e && e.message) || e || ''); }


function addReasons(t, r) {
  return [t].concat(r).map(err2str).filter(Boolean).join(': ');
}


function explain(sc, reasons) {
  let { opt } = sc;
  const {
    ftr,
    code,
    text,
    getLike,
  } = opt;
  (function maybeExtendGetLike() {
    const t = orf(getLike).text;
    if (!t) { return; }
    opt = { ...opt, getLike: { ...getLike, text: addReasons(t, reasons) } };
  }());
  return EX(ftr, code, addReasons(text, reasons), opt);
}


function throwable(sc, arg) {
  if (arg) {
    if (isStr(arg) || Array.isArray(arg)) {
      return throwable(sc, { explain: arg });
    }
  }
  const opt = { ...sc.opt, ...arg };
  let msg = opt.text;
  delete opt.text;
  const ex = opt.explain;
  delete opt.explain;
  if (ex) {
    msg = addReasons(msg, ex);
    if (orf(opt.getLike).text !== undefined) {
      const text = addReasons(opt.getLike.text, ex);
      opt.getLike = { ...opt.getLike, text };
    }
  }
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
