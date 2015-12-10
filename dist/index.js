"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var d = {};
var log = function log(msg) {
  var _console;

  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  return (_console = console).log.apply(_console, [msg].concat(rest));
};
var isBoolean = function isBoolean(o) {
  return typeof o === "boolean";
};
var isFunction = function isFunction(o) {
  var f = {};
  return o && f.toString.call(o) === '[object Function]';
};

function call(a) {
  if (isBoolean(a)) return a;
  if (isFunction(a)) return a(d);
  return false;
}

function and(a) {
  for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    rest[_key2 - 1] = arguments[_key2];
  }

  if (rest.length === 0) {
    return call(a);
  }

  return call(a) && and.apply(undefined, rest);
}

function or(a) {
  if (a === true) return true;

  for (var _len3 = arguments.length, rest = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    rest[_key3 - 1] = arguments[_key3];
  }

  if (rest.length === 0) return call(a);

  return call(a) || or.apply(undefined, rest);
}

function not(a) {
  return !a;
}

var Vercon = function Vercon(data) {
  d = data;
  this.ands = [];
  this.ors = [];
  return this;
};

Vercon.prototype.is = function (input) {
  for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    rest[_key4 - 1] = arguments[_key4];
  }

  return this.and.apply(this, [input].concat(rest));
};

Vercon.prototype.has = function (input) {
  for (var _len5 = arguments.length, rest = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    rest[_key5 - 1] = arguments[_key5];
  }

  return this.and.apply(this, [input].concat(rest));
};

Vercon.prototype.and = function (input) {
  for (var _len6 = arguments.length, rest = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    rest[_key6 - 1] = arguments[_key6];
  }

  this.ands.push(and.apply(undefined, [input].concat(rest)));
  return this;
};

Vercon.prototype.or = function (input) {
  for (var _len7 = arguments.length, rest = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    rest[_key7 - 1] = arguments[_key7];
  }

  this.ors.push(or.apply(undefined, [input].concat(rest)));
  return this;
};

Vercon.prototype.isTrue = function () {
  if (this.ors.length > 0) {
    return or.apply(undefined, [and.apply(undefined, _toConsumableArray(this.ands))].concat(_toConsumableArray(this.ors)));
  }

  return and.apply(undefined, _toConsumableArray(this.ands));
};

module.exports.and = and;
module.exports.is = and;
module.exports.has = and;
module.exports.or = or;
module.exports.not = not;

module.exports.verifyThat = function (o) {
  return new Vercon(o);
};