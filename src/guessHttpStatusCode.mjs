// -*- coding: utf-8, tab-width: 2 -*-

export default function guessHttpStatusCode(x) {
  if (!x) { return; }
  const code = (x.code
    || (x.redirTo && 302)
    || x);
  return (Number.isFinite(code) && (code >= 100) && (code < 600) && code);
};
