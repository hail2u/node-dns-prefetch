'use strict';

var _ = require('lodash');

var args = require('system').args;
var domains = [];
var page = require('webpage').create();
var xhtml = '';

if (args.length < 4) {
  console.log('$ dns-prefetch <URL> [--xhtml]');
  phantom.exit(1);
}

var url = args[3];

if (args.length > 4) {
  if (url === '--xhtml') {
    url = args[4];
  }

  xhtml = ' /';
}

var a = document.createElement('a');
a.href= url;
var urlDomain = a.hostname;

page.onResourceRequested = function(request) {
  a = document.createElement('a');
  a.href= request.url;
  var domain = a.hostname;

  if (!domain || domain === urlDomain) {
    return;
  }

  domains.push(domain);
};
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36';

page.open(url, function () {
  _.uniq(domains).sort().forEach(function (domain) {
    console.log('<link href="//' + domain + '" rel="dns-prefetch"' + xhtml + '>');
  });
  phantom.exit();
});
