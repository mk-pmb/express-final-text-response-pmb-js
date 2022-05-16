
<!--#echo json="package.json" key="name" underline="=" -->
express-final-text-response-pmb
===============================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Respond to an express-style web request with a text and finish it.
<!--/#echo -->


Originally, this module was part of [anno-server-22][as22],
but over time it grew big enough to warrant its own package.

  [as22]: https://github.com/mk-pmb/anno-server-22



API
---

This module exports one function:

### finalTextResponse(req, how)

If `req === null`, return a proxy function for this one
that remembers `how` and only takes `req`.

Otherwise, `req` should be your request object,
and `req.res` must be your response object.

If `how` is a string, it will be treated as if it were an object with
that string as its `text` property.

Otherwise, `how` should be an options object that supports these mostly
optional keys:

* `text`: Your message.
  Required unless `how` is an Error object,
  in which case you should omit the `text` option.
* `code`: Your HTTP status code, as a number.
  Default: `200` usually.
  `500` if `how` was an Error object with no suitable `code` property.
* `type`: What kind of text. Default: `'plain'`,
  which will result in `Content-Type: text/plain; charset=UTF-8`.



&nbsp;

Properties and methods on `finalTextResponse`:

### .customize(customizations)

Return a proxy function for `finalTextResponse` whose config is updated
with your `customizations`, which should be a dictionary object.


### .dfCfg

A dictionary object with the default config.
Do not modify this directly; instead, use `.customize()` to get
a customized `finalTextResponse`.

* `knownMimeTypes`: A dictionary object for `type`s that don't fit
  the default template.
* `endStr`: A string. If non-empty and the message does not end with
  this string already, it is appended.
  Default: `'\n'`







Usage
-----

For examples, have a look at [anno-server-22][as22].



<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
MIT
<!--/#echo -->
