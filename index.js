#!/usr/bin/env node

"use strict";

var path = require("path");
var phantomjs = require("phantomjs");
var spawn = require("child_process").spawnSync;

var args = process.argv;
args.unshift(path.join(__dirname, "correct.js"));

spawn(phantomjs.path, args, {
  stdio: "inherit"
});
