// -*- coding: utf-8, tab-width: 2 -*-

import guessHttpStatusCode from '../src/guessHttpStatusCode.mjs';


const EX = function handleUnknownError(ftr, err, req, res, next) {
  if (!res) { return EX(ftr, err, req, req.res, req.next); }
  if (!err) { return next(); }
  let logVerb = 'Too late to serve';
  let reply;
  if (!req.res.finished) {
    const code = guessHttpStatusCode(err);
    if (code) {
      reply = err;
      logVerb = 'Serve';
    } else {
      reply = { code: 500, text: 'Internal Server Error' };
      logVerb = 'Censor';
    }
  }

  const { logHUnkErr } = ftr.cfg;
  if (logHUnkErr) {
    const msg = logVerb + ' error message for';
    logHUnkErr({ logVerb, msg, err, req });
  }

  if (reply) { ftr(req, reply); }
};


export default EX;
