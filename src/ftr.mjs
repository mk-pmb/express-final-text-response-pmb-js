// -*- coding: utf-8, tab-width: 2 -*-

import sortedJson from 'safe-sortedjson';

import dfCfg from './dfCfg.mjs';
import installApi from './installApi.mjs';
import oneshot from './oneshot.mjs';
import simpleCanned from './simpleCanned.mjs';


const api = {

  json(ftr, req, data, opt) {
    const text = (opt.sorted === false
      ? JSON.stringify(data, null, 2)
      : sortedJson(data));
    return ftr(req, { type: 'json', text, ...opt });
  },

  simpleCanned,

};


function customize(customizations) {
  const f = function sendFinalTextResponse(req, how) {
    return oneshot(f.cfg, req, how);
  };
  f.cfg = (customizations ? { ...dfCfg, ...customizations } : dfCfg);
  installApi(f, api);
  return f;
}


const EX = customize();

Object.assign(EX, {
  customize,
  dfCfg,
  oneshot,
});


export default EX;
