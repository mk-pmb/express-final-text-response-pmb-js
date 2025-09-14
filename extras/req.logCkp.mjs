// -*- coding: utf-8, tab-width: 2 -*-

// Example logger functions, assuming the request has a logging method
// .logCkp (ckp = checkpoint):

import preview from 'concise-value-preview-pmb';
import cleanError from 'error-details-without-log-spam-pmb';

function ellip(s, l) { return s.slice(0, l) + (s.length > l ? '…' : ''); }
function tameNewlines(s) { return String(s).trim().replace(/[\r\n]\s*/g, '¶ '); }


const EX = {

  util: {
    ellip,
    tameNewlines,
  },

  logSend(p) { p.req.logCkp('FinTR:', p.code, p.type, preview(p.text)); },

  logHUnkErr(p) { /*
    p = parameters, usually received from
        handleUnknownError() in `./handleUnknownError.mjs`.
    */
    const { err, logRef } = p;
    let t = [];
    const {
      message,
      name,
      shouldBeTraced,
      ...otherDetails
    } = err;
    if (shouldBeTraced === false) {
      t = [tameNewlines(name), tameNewlines(message), otherDetails];
    } else {
      const c = cleanError(err);
      t = [c];
      const msg = tameNewlines(c.message || '');
      if (msg) {
        const stack = String(c.stack || '');
        const lines = stack.split('\n');
        if (lines.length > 10) {
          t.push('// ' + ellip(tameNewlines(msg), 256));
        }
      }
    }
    let { msg } = p;
    if (logRef) { msg += ' <ref:' + logRef + '>'; }
    p.req.logCkp('FinTR err:', msg, ...t);
  },

};



export default EX;
