// -*- coding: utf-8, tab-width: 2 -*-

// Example logger functions, assuming the request has a logging method
// .logCkp (ckp = checkpoint):

import preview from 'concise-value-preview-pmb';
import cleanError from 'error-details-without-log-spam-pmb';

function ellip(s, l) { return s.slice(0, l) + (s.length > l ? '…' : ''); }


const EX = {

  logSend(p) { p.req.logCkp('FinTR:', p.code, p.type, preview(p.text)); },

  logHUnkErr(p) { /*
    p = parameters, usually received from
        handleUnknownError() in `./handleUnknownError.mjs`.
    */
    const { err } = p;
    let t = [];
    const {
      message,
      name,
      shouldBeTraced,
      ...otherDetails
    } = err;
    if (shouldBeTraced === false) {
      t = [name, message, otherDetails];
    } else {
      const c = cleanError(err);
      t = [c];
      const msg = String(c.message || '');
      if (msg) {
        const stack = String(c.stack || '');
        const lines = stack.split('\n');
        if (lines.length > 10) {
          t.push('// ' + ellip(msg.trim().replace(/[\r\n]\s*/g, '¶ '), 256));
        }
      }
    }
    p.req.logCkp('FinTR err:', p.msg, ...t);
  },

};



export default EX;
