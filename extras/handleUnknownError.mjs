// -*- coding: utf-8, tab-width: 2 -*-

import randomUuid from 'uuid-random';

import guessHttpStatusCode from '../src/guessHttpStatusCode.mjs';


const EX = function handleUnknownError(ftr, err, req, res, next) {
  if (!res) { return EX(ftr, err, req, req.res, req.next); }
  if (!err) { return next(); }
  let logVerb = 'Too late to serve';
  let reply;
  const { logHUnkErr, genUnkErrRef } = ftr.cfg;
  let logRef = null;
  if (!req.res.finished) {
    const code = guessHttpStatusCode(err);
    if (code) {
      reply = err;
      logVerb = 'Serve';
    } else {
      reply = { code: 500, text: 'Internal Server Error' };
      if (logHUnkErr) {
        logRef = (genUnkErrRef || randomUuid)();
        reply.text += ' | ref:' + logRef;
      }
      logVerb = 'Censor';
    }
  }

  if (logHUnkErr) {
    const msg = logVerb + ' error message for';
    logHUnkErr({ logVerb, msg, err, req, logRef });
  }

  if (reply) { ftr(req, reply); }
};


export default EX;
