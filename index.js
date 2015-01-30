'use strict';

var _ = require('lodash');
var minimist = require('minimist');

var args = minimist(require('system').args.slice(3), {
  'alias': {
    'x': 'xhtml'
  },
  'boolean': ['xhtml'],
  'default': {
    'xhtml': false
  }
});
var domains = [];
var gatherDomain = function (r) {
  a = document.createElement('a');
  a.href= r.url;
  var domain = a.hostname;

  if (!domain || domain === urlDomain) {
    return;
  }

  domains.push(domain);
};
var page = require('webpage').create();
var xhtml = '';

if (args._.length === 0) {
  console.log('$ dns-prefetch <URL> [--xhtml]');
  phantom.exit(1);
}

var url = args._[0];

if (args.xhtml) {
  xhtml = ' /';
}

var a = document.createElement('a');
a.href= url;
var urlDomain = a.hostname;

page.onResourceError = gatherDomain;
page.onResourceRequested = gatherDomain;
page.onResourceReceived = gatherDomain;
page.onResourceTimeout = gatherDomain;
page.settings.localToRemoteUrlAccessEnabled = true;
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36';
page.settings.webSecurityEnabled = false;
page.settings.XSSAuditingEnabled = true;

page.open(url, function () {
  _.uniq(domains).sort().forEach(function (domain) {
    console.log('<link href="//' + domain + '" rel="dns-prefetch"' + xhtml + '>');
  });
  phantom.exit();
});
