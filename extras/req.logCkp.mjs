// -*- coding: utf-8, tab-width: 2 -*-

// Example logger functions, assuming the request has a logging method
// .logCkp (ckp = checkpoint):

import preview from 'concise-value-preview-pmb';
import cleanError from 'error-details-without-log-spam-pmb';


const EX = {

  logSend(p) { p.req.logCkp('FinTR:', p.code, p.type, preview(p.text)); },

  logHUnkErr(p) {
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
      t = [cleanError(err)];
    }
    p.req.logCkp('FinTR err:', p.msg, ...t);
  },

};



export default EX;
