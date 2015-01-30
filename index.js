'use strict';

var _ = require('lodash');
var minimist = require('minimist');
var pkg = require('./package.json');

var args = minimist(require('system').args.slice(3), {
  'alias': {
    't': 'try',
    'x': 'xhtml'
  },
  'boolean': ['xhtml'],
  'default': {
    'try': 1,
    'xhtml': false
  },
  'string': ['try']
});

if (args._.length === 0) {
  console.log('Usage: ' + Object.keys(pkg.bin)[0] + ' <URL> [--xhtml] [--try=<NUM>]');
  console.log(pkg.description);
  console.log('');
  console.log('  -t <NUM>, --try=<NUM>  Try <NUM> times (default: 1).');
  console.log('  -x, --xhtml            Output XHTML syntax format.');

  phantom.exit(1);
}

var a = document.createElement('a');
var domains = [];
var i = parseInt(args.try);
var url = args._[0];
a.href= url;
var urlDomain = a.hostname;

var gatherDomain = function (r) {
  a.href= r.url;
  var domain = a.hostname;

  if (!domain || domain === urlDomain) {
    return;
  }

  domains.push(domain);
};

var render = function () {
  var page = require('webpage').create();
  page.onResourceError = gatherDomain;
  page.onResourceRequested = gatherDomain;
  page.onResourceReceived = gatherDomain;
  page.onResourceTimeout = gatherDomain;
  page.settings.localToRemoteUrlAccessEnabled = true;
  page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36';
  page.settings.webSecurityEnabled = false;
  page.settings.XSSAuditingEnabled = true;

  page.open(url, function () {
    page.close();
    i--;

    if (i === 0) {
      var xhtml = '';

      if (args.xhtml) {
        xhtml = ' /';
      }

      _.uniq(domains).sort().forEach(function (domain) {
        console.log('<link href="//' + domain + '" rel="dns-prefetch"' + xhtml + '>');
      });

      phantom.exit();
    }

    render();
  });
};

render();
