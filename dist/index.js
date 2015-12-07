"use strict";

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var data = [];
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
var operators = {
  'or': function or(a, b) {
    return call(a) || call(b);
  },
  'and': function and(a, b) {
    return call(a) && call(b);
  }
};

function call(a) {
  if (isBoolean(a)) return a;
  if (isFunction(a)) return a(data);
  return false;
}

function evaluateExpressions(_ref, operator) {
  var _ref2 = _toArray(_ref);

  var head = _ref2[0];

  var tail = _ref2.slice(1);

  var isTrue = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  if (operator === 'or' && isTrue) return true;
  if (operator === 'and' && head == false) return false;
  if (!head && !isBoolean(head)) return isTrue;

  log(operator);
  log("isTrue: ", isTrue);
  log(head, tail);
  var nextOp = tail[0] && tail[0].o ? tail[0].o : operator;
  return evaluateExpressions(tail, nextOp, operators[operator](head.fn || head, isTrue));
}

function and(a) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return evaluateExpressions([a].concat(args), 'and');
}

function or(a) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return evaluateExpressions([a].concat(args), 'or');
}

function is(a) {
  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  return evaluateExpressions([a].concat(args), 'and');
}

function has(a) {
  for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  return evaluateExpressions([a].concat(args), 'and');
}

function getExp(o, fn) {
  return { o: o, fn: fn };
}

var Vercon = function Vercon(data) {
  data = data;
  this.chain = [];
  return this;
};

Vercon.prototype.is = function (fn) {
  return this.and(fn);
};

Vercon.prototype.has = function (fn) {
  return this.and(fn);
};

Vercon.prototype.and = function (input) {
  for (var _len6 = arguments.length, rest = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    rest[_key6 - 1] = arguments[_key6];
  }

  var restArgs = rest.map(function (f) {
    return getExp('and', f);
  });
  log("restArgs ", restArgs);
  this.chain.push(and(getExp('and', input), restArgs));
  return this;
};

Vercon.prototype.or = function (input) {
  for (var _len7 = arguments.length, rest = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    rest[_key7 - 1] = arguments[_key7];
  }

  var restArgs = rest.map(function (f) {
    return getExp('or', f);
  });
  this.chain.push(or(getExp('or', restArgs), restArgs));
  return this;
};

Vercon.prototype.isTrue = function () {
  log(this.chain);

  var _chain = _toArray(this.chain);

  var h = _chain[0];

  var rest = _chain.slice(1);

  var val = evaluateExpressions(rest, 'or', call(h.fn));
  log(val);
  return val;
};

module.exports.and = and;
module.exports.or = or;
module.exports.is = is;

module.exports.verifyThat = function (o) {
  return new Vercon(o);
};