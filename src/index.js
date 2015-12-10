"use strict";

var d = {};
const isBoolean = (o) => typeof o === "boolean";
const isFunction = (o) => {
  let f = {};
  return o && f.toString.call(o) === '[object Function]';
}; 

function call(a) {
  if(isBoolean(a)) return a;
  if(isFunction(a)) return a(d);
  return false;
}

function and(a, ...rest) {
  if (rest.length === 0) { 
    return call(a);
  }
  return call(a) && and(...rest);
}

function or(a, ...rest) {
  if (a === true) return true;
  if (rest.length === 0) return call(a);

  return call(a) || or(...rest);
}

function not(a) { return !a; }

var Vercon = function Vercon(data) {
  d = data;
  this.ands = [];
  this.ors = [];
  return this;
};

Vercon.prototype.is = function (input, ...rest) {
  return this.and(input, ...rest);
};
Vercon.prototype.has = function(input, ...rest) {
  return this.and(input, ...rest);
};
Vercon.prototype.and = function(input, ...rest) {
  this.ands.push(and(input, ...rest));
  return this;
};
Vercon.prototype.or = function(input, ...rest) {
  this.ors.push(or(input, ...rest));
  return this;
};
Vercon.prototype.isTrue = function () {
  if (this.ors.length > 0) {
    return or(and(...this.ands), ...this.ors);
  }

  return and(...this.ands);
};


module.exports.and = and;
module.exports.is = and;
module.exports.has = and;
module.exports.or = or;
module.exports.not = not;

module.exports.verifyThat = function(o) {
  return new Vercon(o);
};