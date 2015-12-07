"use strict";

var data = [];
const log = (msg, ...rest) => console.log(msg, ...rest);
const isBoolean = (o) => typeof o === "boolean";
const isFunction = (o) => {
  let f = {};
  return o && f.toString.call(o) === '[object Function]';
} 
const operators = {
  'or': (a, b) => (call(a) || call(b)),
  'and': (a, b) => (call(a) && call(b))
}

function call(a) {
  if(isBoolean(a)) return a;
  if(isFunction(a)) return a(data);
  return false;
}

function evaluateExpressions([head, ...tail], operator, isTrue = true) {
  if (operator === 'or' && isTrue) return true;
  if (operator === 'and' && head == false) return false;
  if (!head && !isBoolean(head)) return isTrue;

  log(operator);
  log("isTrue: ", isTrue);
  log(head, tail);
  var nextOp = (tail[0] && tail[0].o) ? tail[0].o : operator;
  return evaluateExpressions(tail, nextOp, operators[operator](head.fn || head, isTrue));
}

function and(a, ...args) {
  return evaluateExpressions([a].concat(args), 'and');
}

function or(a, ...args) {
  return evaluateExpressions([a].concat(args), 'or');
}

function is(a, ...args) {
  return evaluateExpressions([a].concat(args), 'and');
}

function has(a, ...args) {
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

Vercon.prototype.has = function(fn) {
  return this.and(fn);
};

Vercon.prototype.and = function(input, ...rest) {
  var restArgs = rest.map((f) => getExp('and', f) );
  log("restArgs ", restArgs);
  this.chain.push(and(getExp('and', input), restArgs));
  return this;
};

Vercon.prototype.or = function(input, ...rest) {
  var restArgs = rest.map((f) => getExp('or', f) );
  this.chain.push(or(getExp('or', restArgs), restArgs));
  return this;
};

Vercon.prototype.isTrue = function () {
  log(this.chain);
  var [h, ...rest] = this.chain;

  var val = evaluateExpressions(rest, 'or', call(h.fn));
  log(val);
  return val;
};

module.exports.and = and;
module.exports.or = or;
module.exports.is = is;

module.exports.verifyThat = function(o) {
  return new Vercon(o);
};