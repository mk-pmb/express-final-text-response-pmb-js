// -*- coding: utf-8, tab-width: 2 -*-

export default function guessHttpStatusCode(err) {
  const code = (err.code || err);
  return (Number.isFinite(code) && (code >= 100) && (code < 600) && code);
};
