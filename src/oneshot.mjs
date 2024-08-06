// -*- coding: utf-8, tab-width: 2 -*-

import getOwn from 'getown';
import isErr from 'is-error';
import isStr from 'is-string';

import guessHttpStatusCode from './guessHttpStatusCode.mjs';
import isGetLikeMethod from './isGetLikeMethod.mjs';


function checkGetLike(how, req) {
  const g = how.getLike;
  if (g && isGetLikeMethod(req)) { return g; }
  return false;
}


const EX = function sendFinalTextResponse(cfg, req, how) {
  // console.debug(EX.name, how);
  if (isStr(how)) { return EX(cfg, req, { text: how }); }
  const ifGet = checkGetLike(how, req);
  const type = ifGet.type || how.type || 'plain';
  const errHow = isErr(how) && how;
  const code = (ifGet.code
    || guessHttpStatusCode(how)
    || (errHow ? 500 : 200));

  let { text } = ifGet;
  if (text === undefined) { text = how.text; }
  if (text === undefined) { text = errHow.message || how; }
  text = String(text || '');
  text = (text || '(No message provided.)');

  const { endStr } = cfg;
  if (endStr && (!text.endsWith(endStr))) { text += '\n'; }

  if (cfg.logSend) { cfg.logSend({ req, how, code, type, text }); }

  const rsp = req.res;
  try {
    rsp.status(code);
  } catch (errStatus) {
    console.error(EX.name, 'status:', String(errStatus));
  }

  if (type === 'text') {
    const err = ('Value "text" is invalid for the "type" option.'
      + ' If you really want Content-Type text/text (rather than text/plain),'
      + ' you must specify its full form.');
    throw new Error(err);
  }
  let mt = getOwn(cfg.knownMimeTypes, type);
  if (!mt) { mt = ('text/' + type + '; charset=UTF-8'); }
  if (!mt.includes('/')) {
    throw new Error('Content-Type must contain a slash!');
  }
  if (how.links) { rsp.links(how.links); }
  Object.entries({
    'Content-Type': mt,
    Location: how.redirTo,
    ...how.headers,
  }).forEach(function sendHeader([k, v]) {
    if (!v) { return; }
    try {
      // console.debug('oneshot header:', k, v);
      rsp.header({ [k]: v });
    } catch (errHead) {
      console.error(EX.name, 'Cannot send header:', { k, v, e: errHead });
    }
  });

  try {
    rsp.send(text);
  } catch (sendErr) {
    const errStr = String(sendErr);
    const report = { e: errStr };
    if (asStr.includes('invalid media type')) { report.effType = type; }
    console.error(EX.name, 'Cannot send body:', report);
    throw sendErr;
  }
  rsp.end();
};


export default EX;
