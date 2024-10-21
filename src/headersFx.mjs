// -*- coding: utf-8, tab-width: 2 -*-

import thh from 'trivial-http-headers';


const EX = function headersFx(orig) {
  const hdr ={ ...orig };
  if (hdr.Expires === true) { hdr.Expires = thh.expires.aLongLongTimeAgo; }
  if (hdr.Expires === false) { hdr.Expires = thh.expires.farFuture; }
  return hdr;
};




export default EX;
